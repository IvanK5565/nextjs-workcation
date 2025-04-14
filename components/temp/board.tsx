import { Component, useEffect, useState } from "react";

function Square(num: number) {
  let board = new Array<Array<Cell>>;
  for (let i = 0; i < num; i++) {
    let row = new Array<Cell>;
    for (let j = 0; j < num; j++) {
      let cell = new Cell(j,i);
      cell.setActive();
      row.push(cell);
    }
    board.push(row);
  }
  return board;
}
class Cell {
  public x: number;
  public y: number;
  public isActive: boolean;
  public isLight: boolean;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.isActive = false;
    this.isLight = false;
    this.onClick = this.onClick.bind(this)
  }
  public toggleLight() {
    this.isLight = !this.isLight;
  }
  public setActive() {
    this.isActive = true;
  }
  public onClick(){
    this.toggleLight();
  }
  public getTh() {
    let style = "border m-1 w-10 h-10 rounded-full".concat(this.isLight ? " bg-yellow" : " bg-black");
    return <th onClick={this.onClick}>
      <div className={style}></div>
    </th>
  }
}

function CellComponent({cell}:{cell:Cell}){
  return cell.getTh();
}

function test(points:Array<Cell>){
  let maxX = 0;
  let maxY = 0;
  
  let tempBoard = new Array<Array<Cell>>;
    points.forEach(p => {
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    })
    for (let i = 0; i <= maxY; i++) {
      let row = new Array<Cell>;
      for (let j = 0; j <= maxX; j++) {
        let cell = new Cell(j,i);
        points.forEach(p => {
          if (p.x == j && p.y == i) {
            cell.setActive();
          }
        })
        row.push(cell);
      }
      console.log(row);
      tempBoard.push(row);
    }
    return tempBoard;
}

export default function Board() {
  const [board, setBoard] = useState(Square(3));
  // const [maxX, setMaxX] = useState(0);
  // const [maxY, setMaxY] = useState(0);

  useEffect(()=>{
    // let tempBoard = new Array<Array<Cell>>;
    // points.forEach(p => {
    //   if (p.x > maxX) setMaxX(p.x);
    //   if (p.y > maxY) setMaxY(p.y);
    // })
    // for (let i = 0; i < maxY; i++) {
    //   let row = new Array<Cell>;
    //   for (let j = 0; j < maxX; j++) {
    //     let cell = new Cell();
    //     points.forEach(p => {
    //       if (p.x == j && p.y == i) {
    //         cell.setActive();
    //       }
    //     })
    //     row.push(cell);
    //   }
    //   console.log(row);
    //   tempBoard.push(row);
    // }
    // setBoard(tempBoard)
  }, [])
  function checkPoint(p: Cell) {
    return board[p.y][p.x].isActive;
  }
  function changePoints(ps: Cell[]) {
    ps.forEach(p => {
      board[p.y][p.x].toggleLight();
    })
  }
  function onClick({ x, y }: Cell) {
    let allChangeble: Array<Cell> = new Array(
      new Cell(x, y),
      new Cell(x, y - 1),
      new Cell(x - 1, y),
      new Cell(x, y + 1),
      new Cell(x + 1, y),
    )
    let toChange = new Array;
    allChangeble.forEach(p => {
      if (checkPoint(p)) {
        toChange.push(p);
      }
    });
    changePoints(toChange);
  }

  return <div className="border p-5">
    <div className="border p-2">
      <table>
        <tbody>
          {board.map((row, i) => <tr key={i}>
            {row.map((cell,j) => <CellComponent key={j} cell={cell}/>)}
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>
}