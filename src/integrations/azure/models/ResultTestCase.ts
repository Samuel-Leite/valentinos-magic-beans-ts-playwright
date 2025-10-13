import { Results } from './Results';

/**
* Represents the result payload for a specific test point in Azure DevOps.
* Used when updating the outcome of a test case execution.
*/
export class ResultTestCase {
  /**
   * @param id The unique identifier of the test point in Azure DevOps.
   * @param results The outcome object containing the result code.
   */
  constructor(public id: number, public results: Results) {}
}