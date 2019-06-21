import { BufferWrapper, Environment, ValueAggregator } from "@binr/shared";

export abstract class Statement {
  public abstract read(
    buffer: BufferWrapper,
    environment: Environment,
    valueAggregator: ValueAggregator,
  ): void;
}
