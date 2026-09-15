import type { Audience } from "./programs";
export type CampusView = "building" | "floor" | "room";
export const rooms = [
  {
    id: "ai",
    name: "AI & App Studio",
    floor: 1,
    x: -4.6,
    audience: "Professionals",
    programs: ["agentic-ai", "ai-app"],
    color: "#b9aed2",
    story: "An idea. An agent. A working product.",
    number: "01",
  },
  {
    id: "cyber",
    name: "Cybersecurity Lab",
    floor: 1,
    x: 0,
    audience: "Professionals",
    programs: ["cyber"],
    color: "#9bbcb5",
    story: "Follow the signal. Protect what matters.",
    number: "02",
  },
  {
    id: "data",
    name: "Data Science Lab",
    floor: 1,
    x: 4.6,
    audience: "Professionals",
    programs: ["data"],
    color: "#b2bfd1",
    story: "Turn a little evidence into a big insight.",
    number: "03",
  },
  {
    id: "youth",
    name: "Youth Project Studio",
    floor: 0,
    x: -4.6,
    audience: "Youth",
    programs: ["kuwait-codes", "unicode"],
    color: "#d3b491",
    story: "First lines of code. Projects worth showing.",
    number: "04",
  },
  {
    id: "academy",
    name: "Academy X Studio",
    floor: 0,
    x: 0,
    audience: "Youth",
    programs: ["academy-x"],
    color: "#c4b0c8",
    story: "Build your idea. Find your voice.",
    number: "05",
  },
  {
    id: "juniors",
    name: "Juniors Discovery Lab",
    floor: 0,
    x: 4.6,
    audience: "Juniors",
    programs: ["camps", "workshops", "after-school"],
    color: "#d7c786",
    story: "Small experiments. Extraordinary discoveries.",
    number: "06",
  },
] as const;
export type RoomId = (typeof rooms)[number]["id"];
export const getRoom = (id: RoomId) => rooms.find((r) => r.id === id)!;
export const roomForProgram = (id: string) =>
  rooms.find((r) => (r.programs as readonly string[]).includes(id)) || rooms[0];
export const roomForAudience = (audience: Audience) =>
  rooms.find((r) => r.audience === audience)!;
