
export async function makeGet(url: string, accessToken: string) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Locutio',
    },
  });
  return {
    data: await response.json(),
    headers: response.headers,
    status: response.status,
  };
}

export async function makePost(url: string, data: any, accessToken?: string) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      'User-Agent': 'Locutio',
    },
    body: JSON.stringify(data),
  });
  return {
    response: await response.json(),
    status: response.status,
  };
}
