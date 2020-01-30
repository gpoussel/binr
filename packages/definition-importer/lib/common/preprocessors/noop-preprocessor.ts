import { Preprocessor } from "./preprocessor";

export class NoopPreprocessor extends Preprocessor {
  public preprocess(input: string) {
    return input;
  }
}
