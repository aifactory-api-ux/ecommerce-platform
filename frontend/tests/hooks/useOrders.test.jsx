import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOrders } from '../../src/hooks/useOrders';
import * as api from '../../src/api/order';

vi.mock('../../src/api/order', () => ({
  getOrders: vi.fn(),
  getOrder: vi.fn(),
  createOrder: vi.fn(),
  updateOrderStatus: vi.fn()
}));

describe('useOrders hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns_initial_empty_orders_state', () => {
    const { result } = renderHook(() => useOrders());
    expect(result.current.orders).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('fetches_orders_successfully_and_updates_state', async () => {
    const mockResponse = {
      orders: [{'id': 1, 'user_id': 2, 'status': 'pending', 'total': 100.0, 'items': [{'product_id': 10, 'name': 'Widget', 'price': 50.0, 'quantity': 2}]}]
    };
    api.getOrders.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useOrders());
    await act(async () => {
      await result.current.fetchOrders();
    });

    expect(result.current.orders).toEqual(mockResponse.orders);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles_api_error_and_sets_error_state', async () => {
    api.getOrders.mockRejectedValueOnce({ response: { status: 401, data: { detail: 'Unauthorized' } } });

    const { result } = renderHook(() => useOrders());
    await act(async () => {
      await result.current.fetchOrders();
    });

    expect(result.current.orders).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Unauthorized');
  });

  it('creates_order_and_appends_to_orders_state', async () => {
    const orderRequest = { items: [{'product_id': 5, 'quantity': 1}] };
    const mockResponse = {'id': 2, 'user_id': 2, 'status': 'pending', 'total': 25.0, 'items': [{'product_id': 5, 'name': 'Gadget', 'price': 25.0, 'quantity': 1}]};
    api.createOrder.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useOrders());
    await act(async () => {
      await result.current.createOrder(orderRequest);
    });

    expect(result.current.orders).toContainEqual(expect.objectContaining({ id: 2 }));
  });

  it('create_order_with_invalid_payload_sets_error', async () => {
    const { result } = renderHook(() => useOrders());
    await act(async () => {
      await result.current.createOrder({});
    });

    expect(result.current.orders).toEqual([]);
    expect(result.current.error).toBe('Validation error: items is required');
  });

  it('fetches_single_order_and_updates_selected_order_state', async () => {
    const mockResponse = {'id': 1, 'user_id': 2, 'status': 'paid', 'total': 100.0, 'items': [{'product_id': 10, 'name': 'Widget', 'price': 50.0, 'quantity': 2}]};
    api.getOrder.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useOrders());
    await act(async () => {
      await result.current.fetchOrderById(1);
    });

    expect(result.current.selectedOrder).toEqual(mockResponse);
    expect(result.current.error).toBe(null);
  });

  it('fetch_order_by_id_not_found_sets_error', async () => {
    api.getOrder.mockRejectedValueOnce({ response: { status: 404, data: { detail: 'Order not found' } } });

    const { result } = renderHook(() => useOrders());
    await act(async () => {
      await result.current.fetchOrderById(999);
    });

    expect(result.current.selectedOrder).toBe(null);
    expect(result.current.error).toBe('Order not found');
  });

  it('updates_order_status_and_reflects_in_orders_state', async () => {
    const mockResponse = {'id': 1, 'user_id': 2, 'status': 'shipped', 'total': 100.0, 'items': [{'product_id': 10, 'name': 'Widget', 'price': 50.0, 'quantity': 2}]};
    api.updateOrderStatus.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useOrders());
    result.current.orders = [{'id': 1, 'user_id': 2, 'status': 'pending', 'total': 100.0, 'items': []}];

    await act(async () => {
      await result.current.updateOrderStatus(1, 'shipped');
    });

    expect(result.current.orders.find(o => o.id === 1)?.status).toBe('shipped');
  });

  it('update_order_status_with_invalid_status_sets_error', async () => {
    const { result } = renderHook(() => useOrders());

    await act(async () => {
      await result.current.updateOrderStatus(1, 'invalid_status');
    });

    expect(result.current.error).toBe('Validation error: status must be one of pending, paid, shipped, cancelled');
  });

  it('handles_loading_state_during_fetch_orders', async () => {
    let resolvePromise;
    const promise = new Promise(resolve => { resolvePromise = resolve; });
    api.getOrders.mockReturnValueOnce(promise);

    const { result } = renderHook(() => useOrders());
    const fetchPromise = act(async () => {
      const promise = result.current.fetchOrders();
      expect(result.current.loading).toBe(true);
      await promise;
    });

    await fetchPromise;
    expect(result.current.loading).toBe(false);
  });
});