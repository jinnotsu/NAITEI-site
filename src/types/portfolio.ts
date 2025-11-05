import { Question } from "@/components/QuestionsManager";

export interface Inputs {
  yourName: string;
  hometown: string;
  university: string;
  faculty: string;
  dream: string;
  hobby: string[];
  skill: string[];
  self_pr: string;
  questions: Question[];
}
