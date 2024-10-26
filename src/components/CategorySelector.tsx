import React from 'react';

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategorySelector({ selectedCategory, onSelectCategory }: CategorySelectorProps) {
  const categories = [
    { id: '1-3', name: '1º, 2º y 3º de primaria' },
    { id: '4-6', name: '4º, 5º y 6º de primaria' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Categoría
      </label>
      <div className="flex gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all
              ${selectedCategory === category.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}