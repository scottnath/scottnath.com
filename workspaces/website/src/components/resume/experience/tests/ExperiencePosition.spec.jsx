import React from "react"
import { render } from "@testing-library/react"

import ExperiencePosition from "../ExperiencePosition"

const fixtures = {
  position: "Meow Jobby Job",
  summary: "Jobby summary",
  timeframe: "From now until then",
  description: "<h3>Long description allows HTML</h3>",
  org_name: "Placy Place",
}

/**
 * Gets the elements from a rendered Position component
 * @param {DocumentFragment} docFrag - JavaScript document or JSDOM fragment
 * @param {linkElements} selectors
 * @returns {object} elements gathered from the selectors object
 */
const getPosition = (docFrag, selectors) => {
  const container = docFrag;
  const title = container.querySelector('.title');
  const org = title.querySelector('.org')
  const position = title.querySelector('.job-title')
  const date = container.querySelector('.date');

  return {
    container,
    title,
    org,
    position,
    date,
  };
};

describe("ExperiencePosition", () => {
  it("renders correctly", () => {
    const { container } = render(<ExperiencePosition position={fixtures.position} />);
    const created = getPosition(container);

    expect(created.position.innerHTML).toEqual(fixtures.position);
    expect(created.org.innerHTML).toEqual('');
    expect(created.date.innerHTML).toEqual('');
  })
  it("renders description correctly", () => {
    const { container } = render(<ExperiencePosition position={fixtures.position} summary={fixtures.summary} description={fixtures.description} timeframe={fixtures.timeframe} org_name={fixtures.org_name} />);
    const created = getPosition(container);

    expect(created.position.innerHTML).toEqual(fixtures.position);
    expect(created.org.innerHTML).toEqual(fixtures.org_name);
    expect(created.date.innerHTML).toEqual(fixtures.timeframe);
    expect(created.position.innerHTML).toEqual(fixtures.position);

    // should use Exported Test from ../Details here to test summary and description
    created.summary = container.querySelector('.details').querySelector('.summary');
    created.description = container.querySelector('.details').querySelector('.description');
    expect(created.summary.innerHTML).toEqual(fixtures.summary);
    expect(created.description.innerHTML).toEqual(fixtures.description);
  })
})
