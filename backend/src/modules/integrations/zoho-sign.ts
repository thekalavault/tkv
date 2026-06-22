export class ZohoSignService {
  async createDocument(templateId: string, payload: Record<string, unknown>) {
    const response = await fetch(`https://sign.zoho.com/api/v1/templates/${templateId}/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${process.env.ZOHO_SIGN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  async getDocumentStatus(documentId: string) {
    const response = await fetch(`https://sign.zoho.com/api/v1/documents/${documentId}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${process.env.ZOHO_SIGN_ACCESS_TOKEN}`,
      },
    });
    return response.json();
  }
}
