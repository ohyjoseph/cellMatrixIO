const fs = require('fs');

//================================ Matrix algorithm ============================================
function updateAllCells (matrix) {
  let matrixCopy = JSON.parse(JSON.stringify(matrix));
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrixCopy[i][j] = getUpdatedCellValue(matrix, i, j);
    }
  }
  return matrixCopy;
}

function getUpdatedCellValue (matrix, rowIndex, colIndex) {
  let aliveNeighborCount = 0;
  currentValue = matrix[rowIndex][colIndex];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      if (matrix[rowIndex + i] !== undefined && matrix[rowIndex + i][colIndex + j] !== undefined) {
        if (matrix[rowIndex + i][colIndex + j] === 1) {
          aliveNeighborCount++;
        }
      }
    }
  }
  if (currentValue === 1) {
    if (aliveNeighborCount <= 3) {
      return 1;
    } 
    if (aliveNeighborCount > 3) {
      return 0;
    }
  } else {
    if (aliveNeighborCount >= 3) {
      return 1;
    } else {
      return 0;
    }
  }
}

function updateTopRow (matrix) {
  let matrixCopy = JSON.parse(JSON.stringify(matrix));
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrixCopy[i][j] = getUpdatedCellValue(matrix, i, j);
    }
  }
  return [matrixCopy[0]];
}

function updateMiddleRow (matrix) {
  let matrixCopy = JSON.parse(JSON.stringify(matrix));
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrixCopy[i][j] = getUpdatedCellValue(matrix, i, j);
    }
  }
  return [matrixCopy[1]];
}

function updateBottomRow (matrix) {
  let matrixCopy = JSON.parse(JSON.stringify(matrix));
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrixCopy[i][j] = getUpdatedCellValue(matrix, i, j);
    }
  }
  return [matrixCopy[2]];
}

function stringMatrixUpdateTop (string) {
  return matrixToString(updateTopRow(stringToMatrix(string)));
}

function stringMatrixUpdateMiddle (string) {
  return matrixToString(updateMiddleRow(stringToMatrix(string)));
}

function stringMatrixUpdateBottom (string) {
  return matrixToString(updateBottomRow(stringToMatrix(string)));
}

function stringToMatrix (string) {
  return string.split('\n').filter((value) => value.length > 0).map((value) => value.split(',').map((value => Number(value))));
}

function matrixToString(matrix) {
  return matrix.join('\n') + '\n';
}

function stringMatrixUpdateAll (string) {
  return matrixToString(updateAllCells(stringToMatrix(string)));
}

//================================ Read/Write ============================================
function readStreamLinesPromise() {
  let lineCount = 0;
  return new Promise((resolve) => {
    fs.createReadStream(__dirname + '/readMe.txt')
      .on('data', function(chunk) {
        for (let i = 0; i < chunk.length; i++) {
          if (chunk[i] === 10) {
            lineCount++;
          }
        }
      })
      .on('end', function() {
        resolve(lineCount);
      });
  });
}

function readStreamChunkPromise(fileName, bytesPerRow, lineNumber) {
  return new Promise((resolve) => {
    let myReadStream = fs.createReadStream(__dirname + fileName, {encoding: 'utf8', start: bytesPerRow * lineNumber, end: (bytesPerRow * lineNumber + bytesPerRow * 3) - 1});
    myReadStream.on('data', (chunk) => {
      console.log('CHUNKS: ', lineNumber);
      console.log(chunk + '\n\n');
      resolve(chunk);
    });
  });
}

async function matrixUpdateLoop (cellsPerRow) {
  let bytesPerRow = cellsPerRow * 2;
  let numberOfLines = await readStreamLinesPromise() - 1;
  let myWriteStream = fs.createWriteStream(__dirname + '/writeMe.txt');
  let count = 1;

  for (let lineNumber = 0; lineNumber <= numberOfLines - 2; lineNumber++) {
    let chunk = await readStreamChunkPromise('/readMe.txt', bytesPerRow, lineNumber);
    
    if (lineNumber === 0) {
      myWriteStream.write(count++ + ' ' + stringMatrixUpdateTop(chunk));
    } 
    myWriteStream.write(count++ + ' ' + stringMatrixUpdateMiddle(chunk));
    if (lineNumber === numberOfLines - 2) {
      myWriteStream.write(count++ + ' ' + stringMatrixUpdateBottom(chunk));
    }
  }
}

matrixUpdateLoop(90);
// console.log(updateAllCells([
//   [0,1,1,1,0,1,0],
//   [1,1,1,1,1,1,0],
//   [1,0,0,1,1,0,0],
//   [0,1,1,1,0,1,0],
//   [0,0,0,0,0,0,0],
//   [1,0,0,1,1,0,0],
//   [0,1,1,1,0,1,0]]))
// let matrix = [[0,1,1,1,0,0,0,0,0,1], [1,1,1,1,0,0,0,1,1,1], [0,1,1,1,1,0,0,0,0,1]];
// console.log(updateAllCells(matrix))
// let stringMatrix = '0,1,1,1,0,1,0,0,0,0,1,1,1,0,1,0,0,0,0,1,1,1,0,1,0,0,0,0,1,1,1,0,1,0,0,0,0,1,1,1,0,1,0,0,0\n1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0\n1,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,1\n'
// console.log(stringMatrixUpdate(stringMatrix));

