import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ProductContextForm } from '@/components/product/ProductContextForm';

describe('ProductContextForm', () => {
  const empty = { productName: '', coreIngredients: [], coreSellingPoints: [] };

  it('shows validation errors when empty', async () => {
    const onSubmit = vi.fn();
    render(<ProductContextForm initialValue={empty} onSubmit={onSubmit} />);
    await userEvent.click(screen.getByText('保存并继续'));
    await waitFor(() => expect(onSubmit).not.toHaveBeenCalled());
    expect(screen.getByText(/产品名必填/)).toBeInTheDocument();
  });

  it('submits when all required filled', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ProductContextForm initialValue={empty} onSubmit={onSubmit} />);

    // product name
    await userEvent.type(screen.getByLabelText(/产品名/), 'Test');

    // add an ingredient via the first "添加" button
    const addButtons = screen.getAllByText('添加');
    expect(addButtons.length).toBe(2);
    await userEvent.click(addButtons[0]);
    await userEvent.type(screen.getByPlaceholderText('成分 1'), 'a');

    // re-query after re-render
    await userEvent.click(screen.getAllByText('添加')[1]);
    await userEvent.type(screen.getByPlaceholderText('卖点 1'), 'b');

    await userEvent.click(screen.getByText('保存并继续'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
});