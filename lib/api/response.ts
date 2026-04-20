function decodeResponseText(buffer: ArrayBuffer) {
  return new TextDecoder('utf-8').decode(buffer).replace(/^\uFEFF/, '').trim();
}

export async function parseApiJsonResponse<T>(response: Response): Promise<T> {
  const rawText = decodeResponseText(await response.arrayBuffer());

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}: ${rawText || response.statusText}`);
  }

  if (!rawText) {
    throw new Error('Received empty response body');
  }

  try {
    return JSON.parse(rawText) as T;
  } catch (error) {
    throw new Error(
      `Failed to parse API response as JSON. Content-Type: ${response.headers.get('content-type') || 'unknown'}; ` +
      `Preview: ${rawText.slice(0, 120)}`,
      { cause: error }
    );
  }
}
