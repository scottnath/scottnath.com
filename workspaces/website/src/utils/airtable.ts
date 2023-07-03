import Airtable from 'airtable';

// Setting the Airtable secret API key and the Airtable base id
// from environment variables
const airtableToken = import.meta.env.AIRTABLE_API_KEY;
const airtableBaseId = import.meta.env.AIRTABLE_BASE_ID;

export const nodeFieldCleanup = (fields, itemName) => {
  if (Array.isArray(fields[itemName])) {
    return fields[itemName][0];
  }
  return fields[itemName];
}

/**
 * Gets a resume from airtable
 * @todo: simplify the data gathering process - is there a way *  for airtable to make one object with the whole resume?
 */
export async function getResume() {
  Airtable.configure({ apiKey: airtableToken })
  const base = Airtable.base(airtableBaseId);
  const basicsContent = await base('Basics').select({
    filterByFormula: '({_key} = "Web")',
  }).all()
  const content = {
    basics: {
      title: basicsContent[0].fields.name,
      subtitle: basicsContent[0].fields.title,
      short_summary: basicsContent[0].fields.short_summary,
      summary: basicsContent[0].fields.summary,
      email: basicsContent[0].fields.email,
      phone: basicsContent[0].fields.phone,
      website: basicsContent[0].fields.website,
    },
    skillsets: [] as any[],
    positions: [] as any[],
    projects: [] as any[],
  };
  const resume2023 = await base('Resumes').select({
    filterByFormula: '({Name} = "2023")',
  }).all();
  const content2023 = JSON.parse(JSON.stringify(content));
  content2023.basics.summary = resume2023[0]?.fields?.summary;
  const positions = await base('Positions').select({
    filterByFormula: '({Type} = "Employer")',
    sort: [{field: 'Start', direction: 'desc'}]
  }).all();
  if (positions.length > 0) {
    content.positions = positions.map(position => ({
      position: position.fields.Position,
      summary: position.fields.Summary,
      // description: position.fields.Description,
      org_name: nodeFieldCleanup(position.fields, 'Org Name'),
      org_parent: nodeFieldCleanup(position.fields, 'org_parent'),
      org_url: nodeFieldCleanup(position.fields, 'org_url'),
      timeframe: position.fields.Timeframe,
      truncatable: position.fields.truncatable,
    }));
    content2023.positions = positions.map(position => {
      if (resume2023[0]?.fields?.work?.includes(position.id)) {
        return {
          position: position.fields.Position,
          summary: position.fields.Summary,
          description: position.fields.Description,
          org_name: nodeFieldCleanup(position.fields, 'Org Name'),
          org_parent: nodeFieldCleanup(position.fields, 'org_parent'),
          org_url: nodeFieldCleanup(position.fields, 'org_url'),
          timeframe: position.fields.Timeframe,
          truncatable: position.fields.truncatable,
        }
      }
    }).filter(item => item !== undefined);
  }
  const projects = await base('Positions').select({
    filterByFormula: 'AND(({Type} = "Open Source Project"), NOT({truncatable} = TRUE()))',
    sort: [{field: 'Start', direction: 'desc'}]
  }).all();
  if (projects.length > 0) {
    content.projects = projects.map(project => ({
      position: project.fields.Position,
      summary: project.fields.Summary,
      // description: project.fields.Description,
      org_name: nodeFieldCleanup(project.fields, 'Org Name'),
      github_url: nodeFieldCleanup(project.fields, 'github_url'),
      org_url: nodeFieldCleanup(project.fields, 'org_url'),
      timeframe: project.fields.Timeframe,
      truncatable: project.fields.truncatable,
    }));
    content2023.projects = projects.map(project => {
      if (resume2023[0]?.fields?.work?.includes(project.id)) {
        return {
          position: project.fields.Position,
          summary: project.fields.Summary,
          description: project.fields.Description,
          org_name: nodeFieldCleanup(project.fields, 'Org Name'),
          github_url: nodeFieldCleanup(project.fields, 'github_url'),
          org_url: nodeFieldCleanup(project.fields, 'org_url'),
          timeframe: project.fields.Timeframe,
          truncatable: project.fields.truncatable,
        }
      }
    }).filter(item => item !== undefined);
  }
  const skillsDaily = await base('Skills').select({
    filterByFormula: '({Status} = "Daily")',
    fields: ['Name', 'New', 'SME'],
    sort: [{field: 'SME', direction: 'asc'}]
  }).all();
  if (skillsDaily.length > 0) {
    content.skillsets.push({
      title: 'Daily development with',
      skills: skillsDaily.map(skill => skill.fields.Name)
    });
    content2023.skillsets.push({
      title: 'Daily development with',
      skills: skillsDaily.map(skill => skill.fields.Name)
    });
  }
  const skillsRecent = await base('Skills').select({
    filterByFormula: '({Status} = "Recent")',
    fields: ['Name', 'New', 'SME'],
    sort: [{field: 'SME', direction: 'asc'}]
  }).all();
  if (skillsRecent.length > 0) {
    content.skillsets.push({
      title: 'Recent experience with',
      skills: skillsRecent.map(skill => skill.fields.Name)
    });
    content2023.skillsets.push({
      title: 'Recent experience with',
      skills: skillsRecent.map(skill => skill.fields.Name)
    });
  }
  return content2023;
}