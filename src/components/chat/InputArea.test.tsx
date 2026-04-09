import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputArea } from './InputArea';

describe('InputArea', () => {
  it('по клику «Отправить» с непустым полем вызывается onSendMessage с текстом', async () => {
    const onSend = jest.fn();
    render(
      <InputArea
        onSendMessage={onSend}
        onStopGeneration={jest.fn()}
        isLoading={false}
      />
    );
    const ta = screen.getByRole('textbox', { name: /текст сообщения/i });
    await userEvent.type(ta, 'Привет');
    await userEvent.click(screen.getByRole('button', { name: /отправить/i }));
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith('Привет');
  });

  it('по Enter с непустым вводом вызывается onSendMessage', async () => {
    const onSend = jest.fn();
    render(
      <InputArea
        onSendMessage={onSend}
        onStopGeneration={jest.fn()}
        isLoading={false}
      />
    );
    const ta = screen.getByRole('textbox', { name: /текст сообщения/i });
    await userEvent.type(ta, 'test');
    fireEvent.keyDown(ta, { key: 'Enter', code: 'Enter', shiftKey: false });
    expect(onSend).toHaveBeenCalledWith('test');
  });

  it('кнопка «Отправить» disabled при пустом поле', () => {
    render(
      <InputArea
        onSendMessage={jest.fn()}
        onStopGeneration={jest.fn()}
        isLoading={false}
      />
    );
    expect(screen.getByRole('button', { name: /отправить/i })).toBeDisabled();
  });

  it('кнопка «Отправить» disabled при только пробелах', async () => {
    render(
      <InputArea
        onSendMessage={jest.fn()}
        onStopGeneration={jest.fn()}
        isLoading={false}
      />
    );
    const ta = screen.getByRole('textbox', { name: /текст сообщения/i });
    await userEvent.type(ta, '   ');
    expect(screen.getByRole('button', { name: /отправить/i })).toBeDisabled();
  });
});
