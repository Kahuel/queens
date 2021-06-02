import React, { useState } from "react";
import "./App.css";

interface Cell {
  x: number;
  y: number;
  position: number;
  hitting: number[];
}

const generateHitting = (x: number, y: number, position: number) => {
  const result: number[] = [];
  for (let i = 0; x - i > 0 && y - i > 0; i += 1) {
    const newCell = position - i * 9;
    if (!result.includes(newCell)) {
      result.push(newCell);
    }
  }
  for (let i = 0; x + i < 9 && y + i < 9; i += 1) {
    const newCell = position + i * 9;
    if (!result.includes(newCell)) {
      result.push(newCell);
    }
  }
  for (let i = 0; x + i < 9 && y - i > 0; i += 1) {
    const newCell = position - i * 7;
    if (!result.includes(newCell)) {
      result.push(newCell);
    }
  }
  for (let i = 0; x - i > 0 && y + i < 9; i += 1) {
    const newCell = position + i * 7;
    if (!result.includes(newCell)) {
      result.push(newCell);
    }
  }
  for (let i = 1; i < 9; i += 1) {
    const newCell = (y - 1) * 8 + i;
    if (!result.includes(newCell)) {
      result.push(newCell);
    }
  }
  for (let i = 0; i < 8; i += 1) {
    const newCell = position - (y - 1) * 8 + i * 8;
    if (!result.includes(newCell)) {
      result.push(newCell);
    }
  }
  return result.sort((a: number, b: number) => a - b);
};

const getSolution = (
  initQuuens: Cell[],
  extraHittedCells: number[] = []
): { status: string; queens: Cell[] } => {
  if (initQuuens.length === 8) {
    return { status: "complited", queens: initQuuens };
  }
  const hittedCells = [
    ...initQuuens.reduce((acc: number[], el: Cell) => {
      const newHittedCells = el.hitting.filter(
        (pos: number) => !acc.includes(pos)
      );
      return [...acc, ...newHittedCells];
    }, []),
    ...extraHittedCells,
  ];

  for (let i = 1; i <= 64; i += 1) {
    if (!hittedCells.includes(i)) {
      const x = i % 8 === 0 ? 8 : i % 8;
      const y = i - x === 0 ? 1 : (i - x) / 8 + 1;
      const position = i;
      const hitting = generateHitting(x, y, position);
      const iter = getSolution([...initQuuens, { x, y, position, hitting }]);
      if (iter.status === "failed") {
        return getSolution(initQuuens, [...extraHittedCells, i]);
      } else if (iter.status === "complited") {
        return iter;
      }
    }
  }
  return { status: "failed", queens: initQuuens };
};

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[]>([]);
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

  const hittedCells = cells.reduce((acc: number[], el: Cell) => {
    const newHittedCells = el.hitting.filter(
      (pos: number) => !acc.includes(pos)
    );
    return [...acc, ...newHittedCells];
  }, []);

  return (
    <div>
      <p>
        Выберете ячейку(и), которая(ые) должны присутствовать в решении. Нажмите
        кнопку "найти решение".
      </p>
      <p>Зелёным цветом обозначается положение ферзей, красным - битые поля.</p>
      <p>Кнопка "Очистить" удаляет всех ферзей с поля.</p>
      <div className="board">
        {numbers.map((elY: number) => {
          return (
            <div className="row">
              {numbers.map((elX: number) => {
                const position = elX + (elY - 1) * 8;
                return (
                  <span
                    className={`${(elX + elY) % 2 === 0 ? "white" : "black"} ${
                      hittedCells.includes(position) ? "red" : ""
                    } ${
                      cells.findIndex(
                        (cell: Cell) => cell.position === position
                      ) !== -1
                        ? "green"
                        : ""
                    }`}
                    onClick={() => {
                      const index = cells.findIndex(
                        (el: Cell) => el.x === elX && el.y === elY
                      );
                      if (index !== -1) {
                        setCells(
                          cells.filter((el: Cell, i: number) => i !== index)
                        );
                      } else if (
                        cells.length < 8 &&
                        !hittedCells.includes(position)
                      ) {
                        setCells([
                          ...cells,
                          {
                            x: elX,
                            y: elY,
                            position: position,
                            hitting: generateHitting(elX, elY, position),
                          },
                        ]);
                      }
                    }}
                  >
                    {position}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          const solution = getSolution(cells);
          if (solution.status === "complited") {
            setCells(solution.queens);
          } else {
            alert("Решений не найдено");
          }
        }}
      >
        Найти решение.
      </button>
      <button onClick={() => setCells([])}>Очистить.</button>
    </div>
  );
};

export default App;
