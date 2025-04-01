import React, { useEffect, useState } from "react";
import { Button } from "./button";
import axios from "axios";

export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=3";

export const Form = (props: React.ComponentProps<"form">) => {
  const [items, setItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    axios.get<Todo[]>(API_URL).then((res) => setItems(res.data.map((todo) => todo.title)));
  }, []);

  const handleButtonClick = () => {
    if (inputValue.trim() !== "") {
      setItems([...items, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleAddItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      setItems([...items, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <form
      {...props}
      onSubmit={(e) => e.preventDefault()}
      className='shadow-md flex flex-col bg-zinc-50 rounded-lg p-6 w-full max-w-md mx-auto'>
      <h2 className='text-lg font-semibold mb-4 text-gray-700'>Lista de Itens</h2>

      {/* Input */}
      <label htmlFor='item' className='mr-auto mb-1'>
        Adicione um item
      </label>
      <div className='relative'>
        <input
          type='text'
          id='item'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddItem}
          placeholder='Digite um item e pressione Enter'
          className='border border-gray-300 rounded-md w-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
        />
        <Button
          type='button'
          onClick={handleButtonClick}
          className='absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-sm rounded-md transition-all'>
          Enviar
        </Button>
      </div>

      {/* Lista de Itens */}
      <ul className='mt-4 space-y-2'>
        {items.map((item, index) => (
          <li key={index} className='flex items-center gap-2 bg-gray-100 p-2 rounded-md shadow-sm'>
            {item}
            <Button
              type='button'
              aria-label={`Remover item "${item}"`}
              onClick={() => handleRemoveItem(index)}
              className='bg-white hover:bg-red-100 border border-red-400 cursor-pointer text-white px-3 py-1 rounded-md transition-all'>
              ❌
            </Button>
          </li>
        ))}

        <li className='hidden first-of-type:block'>Lista vazia</li>
      </ul>
    </form>
  );
};
