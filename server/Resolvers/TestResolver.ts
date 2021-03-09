/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Resolver, Int } from "type-graphql";

@Resolver()
export class TestResolver {
  @Query(_type => Int)
  theMeaningOfLife(): number {
    return 42;
  }
}