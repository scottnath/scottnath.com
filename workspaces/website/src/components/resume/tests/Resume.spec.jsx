import React from "react"
import { render } from "@testing-library/react"

import Resume from "../Resume"

const fixtures = {
  title: "Sets of skills title",
  skillsets: [
    {
      title: "skillset one",
      skills: ['1','2','3','4'],
    },
    {
      title: "skillset 2",
      skills: ['one', 'two', 'three', 'four'],
    },
  ],
}

/**
 * Gets the elements from a rendered Details component
 * @param {DocumentFragment} docFrag - JavaScript document or JSDOM fragment
 * @param {linkElements} selectors
 * @returns {object} elements gathered from the selectors object
 */
const getResume = (docFrag, selectors) => {
  const container = docFrag;
  const title = container.querySelector('.title');
  const skills = container.querySelector('.skills');
  const skillsets = skills.querySelectorAll('.skillset');

  return {
    container,
    title,
    skills,
    skillsets,
  };
};

describe("Resume", () => {
  it("renders correctly with defaults", () => {
    const { container } = render(<Resume  />);
    const created = getResume(container);

    expect(created.title.innerHTML).toEqual(Resume.defaultProps.title);
    expect(created.skills).toBeDefined();
    expect(created.skills.innerHTML).toEqual('');
  })
  it("renders correctly with parameters", () => {
    const { container } = render(<Resume {...fixtures} />);
    const created = getResume(container);

    expect(created.title.innerHTML).toEqual(fixtures.title);
    expect(created.skillsets).toHaveLength(fixtures.skillsets.length)
    // @todo make `getSkillSets` and test the output
  })
})
