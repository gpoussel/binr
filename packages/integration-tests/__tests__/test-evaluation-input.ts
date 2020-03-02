import { readFileSync } from "fs";

import { EvaluationInput } from "@binr/ast";

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;

export class TestEvaluationInput implements EvaluationInput {
  private buffer: Buffer;

  public constructor(private filename: string) {
    this.buffer = readFileSync(`${pathToBinaryFixtures}/${this.filename}`);
  }

  public get size(): number {
    return this.buffer.byteLength;
  }
}
