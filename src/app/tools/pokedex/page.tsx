"use client";

import { useState } from "react";
import {
  Column,
  Heading,
  Text,
  Flex,
  Row,
  Button,
  Input,
  Card,
} from "@once-ui-system/core";

interface PokemonData {
  name: string;
  id: number;
  sprites: { front_default: string; other: { "official-artwork": { front_default: string } } };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
}

const typeColors: Record<string, string> = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
  steel: "#B7B7CE", fairy: "#D685AD",
};

export default function PokedexPage() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Enter a Pokémon name or ID");
      return;
    }

    setLoading(true);
    setError(null);
    setPokemon(null);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.trim().toLowerCase()}`);
      if (!res.ok) throw new Error("Pokémon not found — check the name or ID");
      const data: PokemonData = await res.json();
      setPokemon(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch Pokémon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        Pokédex Lookup
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Search any Pokémon by name or ID number
      </Text>
      <Text onBackground="neutral-weak" variant="body-default-s" align="center">
        Powered by PokéAPI (free, no API key required)
      </Text>

      <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
        <Column gap="m">
          <Input
            id="pokemon-query"
            label="Pokémon Name or ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Pikachu, Charizard, 25"
          />

          <Flex fillWidth horizontal="end">
            <Button size="l" variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </Flex>
        </Column>
      </Card>

      {error && (
        <Text variant="body-default-s" onBackground="danger-weak">
          {error}
        </Text>
      )}

      {pokemon && (
        <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
          <Column gap="l">
            <Row gap="l" vertical="center" wrap={true}>
              <img
                src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "var(--radius-m)",
                  background: "var(--neutral-background)",
                  objectFit: "contain",
                }}
              />
              <Column gap="s">
                <Heading as="h2" variant="heading-strong-l" style={{ textTransform: "capitalize" }}>
                  #{String(pokemon.id).padStart(3, "0")} {pokemon.name}
                </Heading>
                <Row gap="8" wrap={true}>
                  {pokemon.types.map((t) => (
                    <span
                      key={t.type.name}
                      style={{
                        padding: "0.15rem 0.75rem",
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#fff",
                        background: typeColors[t.type.name] || "#999",
                        textTransform: "capitalize",
                      }}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </Row>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Height: {(pokemon.height / 10).toFixed(1)} m | Weight: {(pokemon.weight / 10).toFixed(1)} kg
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Abilities: {pokemon.abilities.map((a) => a.ability.name.replace("-", " ")).join(", ")}
                </Text>
              </Column>
            </Row>

            <Heading as="h3" variant="heading-strong-xs">Base Stats</Heading>
            <Column gap="s">
              {pokemon.stats.map((s) => {
                const statName = s.stat.name.replace("-", " ");
                const maxStat = 255;
                const pct = Math.min((s.base_stat / maxStat) * 100, 100);
                return (
                  <Column key={s.stat.name} gap="4">
                    <Row horizontal="between" fillWidth>
                      <Text variant="body-default-s" style={{ textTransform: "capitalize" }}>
                        {statName}
                      </Text>
                      <Text variant="body-default-s" style={{ fontWeight: 600 }}>
                        {s.base_stat}
                      </Text>
                    </Row>
                    <div
                      style={{
                        height: "8px",
                        borderRadius: "4px",
                        background: "var(--neutral-background)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          borderRadius: "4px",
                          background: s.base_stat >= 100 ? "#7AC74C" : s.base_stat >= 50 ? "#F7D02C" : "#EE8130",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </Column>
                );
              })}
            </Column>
          </Column>
        </Card>
      )}
    </Column>
  );
}
