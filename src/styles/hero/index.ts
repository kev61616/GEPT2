import { AnimatedHeroes } from "./animated";
import { MinimalHeroes } from "./minimal";
import { GradientHeroes } from "./gradient";
import { InteractiveHeroes } from "./interactive";
import { SplitHeroes } from "./split";

export const HeroSections = [
  ...AnimatedHeroes,
  ...MinimalHeroes,
  ...GradientHeroes,
  ...InteractiveHeroes,
  ...SplitHeroes
];