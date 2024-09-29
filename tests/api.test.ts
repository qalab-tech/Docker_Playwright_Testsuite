import { test, expect, request } from '@playwright/test';
import * as fs from 'fs';
import * as yaml from 'yaml';

// Read config.yaml information
const config = yaml.parse(fs.readFileSync('config.yaml', 'utf8'));
const BASE_URL = config["Base Application URL"];

test.describe('Flask Microservice API Tests', () => {
  test('GET /customers - should return a list of customers', async ({ request }) => {
    const response = await request.get(BASE_URL);
    expect(response.status()).toBe(200);
    const customers = await response.json();
    expect(Array.isArray(customers)).toBe(true);
  });

  test('POST /customers - should create a new customer', async ({ request }) => {
    const newCustomer = { name: 'New User', address: '5678 New Ave' };
    const response = await request.post(BASE_URL, {
      data: newCustomer,
    });
    expect(response.status()).toBe(201);
    const createdCustomer = await response.json();
    expect(createdCustomer).toHaveProperty('customer_id');
    expect(createdCustomer.name).toBe(newCustomer.name);
    expect(createdCustomer.address).toBe(newCustomer.address);
  });

  test('GET /customers/:id - should retrieve a customer', async ({ request }) => {
    const newCustomer = { name: 'Test User', address: '1234 Test St' };
    const createResponse = await request.post(BASE_URL, { data: newCustomer });
    const createdCustomer = await createResponse.json();

    const response = await request.get(`${BASE_URL}/${createdCustomer.customer_id}`);
    expect(response.status()).toBe(200);
    const customer = await response.json();
    expect(customer.customer_id).toBe(createdCustomer.customer_id);
    expect(customer.name).toBe(newCustomer.name);
    expect(customer.address).toBe(newCustomer.address);
  });

  test('PUT /customers/:id - should update a customer', async ({ request }) => {
    const newCustomer = { name: 'User', address: 'Test Ave' };
    const createResponse = await request.post(BASE_URL, { data: newCustomer });
    const createdCustomer = await createResponse.json();

    const updatedData = { name: 'Updated User', address: 'Updated Address' };
    const response = await request.put(`${BASE_URL}/${createdCustomer.customer_id}`, {
      data: updatedData,
    });
    expect(response.status()).toBe(200);
    const updatedCustomer = await response.json();
    expect(updatedCustomer.name).toBe(updatedData.name);
    expect(updatedCustomer.address).toBe(updatedData.address);
  });

  test('DELETE /customers/:id - should delete a customer', async ({ request }) => {
    const newCustomer = { name: 'Delete Me', address: 'Somewhere' };
    const createResponse = await request.post(BASE_URL, { data: newCustomer });
    const createdCustomer = await createResponse.json();

    const response = await request.delete(`${BASE_URL}/${createdCustomer.customer_id}`);
    expect(response.status()).toBe(200);
    const deleteMessage = await response.json();
    expect(deleteMessage.message).toBe('Customer deleted');

    const getResponse = await request.get(`${BASE_URL}/${createdCustomer.customer_id}`);
    expect(getResponse.status()).toBe(404);
    const errorResponse = await getResponse.json();
    expect(errorResponse.error).toBe('Customer not found');
  });
});
