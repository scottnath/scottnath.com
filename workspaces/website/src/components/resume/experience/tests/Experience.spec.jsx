import React from "react"
import { render } from "@testing-library/react"

import Experience from "../Experience"

const fixtures = {
  title: "Jobby job history",
  positions: [
    {
      position: "Meow Jobby Job",
      summary: "Jobby summary",
      timeframe: "From now until then",
      description: "<h3>Long description allows HTML</h3>",
      org_name: "Placy Place",
    },
    {
      position: "Woof Jobby Job",
      summary: "Woof summary",
      timeframe: "From nose until tail",
      description: "<h3>Long description allows Woof Woof Woof</h3>",
      org_name: "Placy Placerton",
    },
  ],
}

/**
 * Gets the elements from a rendered Experience component
 * @param {DocumentFragment} docFrag - JavaScript document or JSDOM fragment
 * @param {linkElements} selectors
 * @returns {object} elements gathered from the selectors object
 */
const getExperience = (docFrag, selectors) => {
  const container = docFrag;

  return {
    container,
    title: container.querySelector('.title'),
    positionsContainer: container.querySelector('.positions'),
    positions: container.querySelectorAll('.position')
  };
};

describe("Experience", () => {
  it("renders correctly", () => {
    const { container } = render(<Experience />);
    const created = getExperience(container);

    expect(created.title.innerHTML).toEqual(Experience.defaultProps.title);
    expect(created.positionsContainer).toBeDefined();
    expect(created.positionsContainer.innerHTML).toEqual('');
  })
  it("renders description correctly", () => {
    const { container } = render(<Experience {...fixtures}/>);
    const created = getExperience(container);

    expect(created.title.innerHTML).toEqual(fixtures.title);
    expect(created.positions).toHaveLength(fixtures.positions.length);
    created.positions.forEach(position => {
      expect(position).toBeDefined();
      // @todo exported tests from `ExperiencePosition`
    })

  })
})
