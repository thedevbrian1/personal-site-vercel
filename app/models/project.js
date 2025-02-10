const queryUrl = `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2022-10-20/data/query/production`;

export async function getProjects() {
    let projectsQuery = `*[_type == "project"] | order(order asc) {_id, title, image{asset-> {url}}, altText, projectUrl}`;
    let projectsUrl = `${queryUrl}?query=${encodeURIComponent(projectsQuery)}`;
    let res = await fetch(projectsUrl);
    let data = await res.json();

    return data.result;
}