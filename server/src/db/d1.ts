export interface D1QueryResult<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

export interface D1ApiResponse<T = Record<string, unknown>> {
  result: D1QueryResult<T>[];
  success: boolean;
  errors: { code: number; message: string }[];
  messages: string[];
}

export class D1Client {
  private accountId: string;
  private databaseId: string;
  private apiToken: string;
  private endpoint: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
    this.databaseId = process.env.CLOUDFLARE_DATABASE_ID || '';
    this.apiToken = process.env.CLOUDFLARE_D1_TOKEN || process.env.CLOUDFLARE_API_TOKEN || '';
    this.endpoint = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
  }

  public isConfigured(): boolean {
    return Boolean(this.accountId && this.databaseId && this.apiToken);
  }

  public async query<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = []
  ): Promise<T[]> {
    if (!this.isConfigured()) {
      throw new Error(
        'Cloudflare D1 credentials missing. Please set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, and CLOUDFLARE_D1_TOKEN.'
      );
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
        params,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudflare D1 API HTTP error (${response.status}): ${errText}`);
    }

    const json = (await response.json()) as D1ApiResponse<T>;

    if (!json.success || !json.result || json.result.length === 0) {
      const errorMsg = json.errors?.map((e) => e.message).join(', ') || 'Unknown D1 query error';
      throw new Error(`Cloudflare D1 Query Error: ${errorMsg}`);
    }

    return json.result[0].results ?? [];
  }

  public async execute(
    sql: string,
    params: unknown[] = []
  ): Promise<D1QueryResult> {
    if (!this.isConfigured()) {
      throw new Error(
        'Cloudflare D1 credentials missing. Please set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, and CLOUDFLARE_D1_TOKEN.'
      );
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
        params,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudflare D1 API HTTP error (${response.status}): ${errText}`);
    }

    const json = (await response.json()) as D1ApiResponse;

    if (!json.success || !json.result || json.result.length === 0) {
      const errorMsg = json.errors?.map((e) => e.message).join(', ') || 'Unknown D1 execute error';
      throw new Error(`Cloudflare D1 Execute Error: ${errorMsg}`);
    }

    return json.result[0];
  }
}

export const d1 = new D1Client();
