import { client } from './client';

describe('client function', () => {
  test('should fetch data with GET request', async () => {
    const response = await client.get("/fakeApi/posts");
    console.log(response)
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('name');
  });
});
