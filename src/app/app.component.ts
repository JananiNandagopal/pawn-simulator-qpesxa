import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /** boolean to check if place button is clicked based on which some buttons are enabled */
  public isplaceClicked: boolean = false;
  /** boolean to check if the move button is clicked first  */
  public isFirstMove: boolean = false;
  /** boolean used to show the data in UI when report button is clicked*/
  public isReport: boolean = false;
  /** to hold the values for move values radio button 1 or 2 moves*/
  public moveValue = [1, 2];
  /** to hold the total move value a click can make*/
  public noOfMoves: number = 1;
  /** a form for getting the place values from user */
  public myChessPlaceForm!: FormGroup;
  /** a object to hold the values to show in UI on report button click*/
  public reportValues = {
    x: 0,
    y: 0,
    facing: 'West',
    color: 'Black',
  };
  /** to have track on number of times the move button is clicked*/
  public counter = 0;

  constructor(private fb: FormBuilder) {}

  /** on-init life cyle hook  */
  ngOnInit(): void {
    this.initializeForm();
  }
  /** method to intialize the chess board in UI*/
  initializeBoard() {
    let x_cord = this.myChessPlaceForm.get('xCoord')?.value;
    let y_cord = this.myChessPlaceForm.get('yCoord')?.value;
    const squareSize = 50;
    // position of board's top left
    const boardTopx = 0;
    const boardTopy = 0;
    const canvas = <HTMLCanvasElement>(
      document.getElementById('canvasChessboard')
    );
    const context = canvas?.getContext('2d');
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        context!.fillStyle = (i + j) % 2 == 0 ? 'white' : 'black';
        let xOffset = boardTopx + j * squareSize;
        let yOffset = boardTopy + i * squareSize;
        context!.fillRect(xOffset, yOffset, squareSize, squareSize);
        if (i === x_cord && j === y_cord) {
          context!.fillStyle = 'pawn-color';
          context!.fillRect(xOffset, yOffset, squareSize, squareSize);
        }
      }
    }
    // draw the border around the chessboard
    context!.strokeStyle = 'black';
    context!.strokeRect(boardTopx, boardTopy, squareSize * 8, squareSize * 8);
  }
  /** to initalize the chessform with initial values and call the method to initialize board*/
  initializeForm() {
    this.myChessPlaceForm = this.fb.group({
      xCoord: new FormControl(0, Validators.required),
      yCoord: new FormControl(0, Validators.required),
      facing: new FormControl('1', Validators.required),
      color: new FormControl('0', Validators.required),
    });
    this.initializeBoard();
  }
  /** a method fired when place button is clicked to set booleans when form is submitted*/
  onSubmit(form: FormGroup) {
    this.isFirstMove = true;
    this.isplaceClicked = false;
    if (form.valid) {
      this.isplaceClicked = true;
    } else {
      this.isplaceClicked = false;
    }
  }
  /** a method to change the pawn direction when left button is clicked */
  onLeft() {
    let facing = this.myChessPlaceForm.get('facing')?.value;
    //e
    if (facing === '0') {
      this.myChessPlaceForm?.get('facing')?.setValue('2');
    } //w
    else if (facing === '1') {
      this.myChessPlaceForm?.get('facing')?.setValue('3');
    } //n
    else if (facing === '2') {
      this.myChessPlaceForm?.get('facing')?.setValue('1');
    } //s
    else {
      this.myChessPlaceForm?.get('facing')?.setValue('0');
    }
  }
  /** a method to change the pawn direction when right button is clicked*/
  onRight() {
    let facing = this.myChessPlaceForm.get('facing')?.value;
    //e
    if (facing === '0') {
      this.myChessPlaceForm?.get('facing')?.setValue('3');
    } //w
    else if (facing === '1') {
      this.myChessPlaceForm?.get('facing')?.setValue('2');
    } //n
    else if (facing === '2') {
      this.myChessPlaceForm?.get('facing')?.setValue('0');
    } //s
    else {
      this.myChessPlaceForm?.get('facing')?.setValue('1');
    }
  }
  /** to get the move value selected by user on radio button seletion  */
  onMoveSelect(val: number) {
    this.noOfMoves = val;
  }
  /** method to change the location of the pawn based on the move option selected*/
  onMove() {
    let moveCount;
    this.counter++;
    let x_cord = this.myChessPlaceForm.get('xCoord')?.value;
    let y_cord = this.myChessPlaceForm.get('yCoord')?.value;
    let facing = this.myChessPlaceForm.get('facing')?.value;
    if (y_cord === 0 && facing === '2') {
      moveCount = this.isFirstMove ? this.noOfMoves : 1;
    } else {
      moveCount = 1;
    }

    if (y_cord === 0) {
      if (
        facing === '3' ||
        (x_cord === 0 && (facing === '1' || facing === '3')) ||
        (x_cord === 7 && (facing === '0' || facing === '2'))
      ) {
        return;
      }
    }
    if (y_cord === 7) {
      if (
        facing === '2' ||
        (x_cord === 0 && (facing === '1' || facing === '2')) ||
        (x_cord === 7 && (facing === '2' || facing === '0'))
      ) {
        return;
      }
    }
    if ((x_cord === 0 && facing === '1') || (x_cord === 7 && facing === '0')) {
      return;
    }
    if (y_cord === 1) {
      if (facing === '3' && moveCount === 2) {
        return;
      }
      if (x_cord === 1 && facing === '1' && moveCount === 2) {
        return;
      }
      if (x_cord === 6 && facing === '0' && moveCount === 2) {
        return;
      }
    }
    if (x_cord === 6) {
      if (facing === '2' && moveCount === 2) {
        return;
      }
      if (y_cord === 6 && facing === '0' && moveCount === 2) {
        return;
      }
      if (y_cord === 1 && facing === '1' && moveCount === 2) {
        return;
      }
    }
    if (x_cord === 1) {
      if (facing === '1' && moveCount === 2) {
        return;
      }
      if (y_cord === 6 && facing === '2' && moveCount === 2) {
        return;
      }
    }
    if (y_cord === 6) {
      if (facing === '1' && moveCount === 2) {
        return;
      }
      if (x_cord === 6 && facing === '2' && moveCount === 2) {
        return;
      }
    } else {
      if (facing === '0') {
        x_cord = x_cord + moveCount;
        this.myChessPlaceForm?.get('xCoord')?.setValue(x_cord);
      } else if (facing === '1') {
        x_cord = x_cord - moveCount;
        this.myChessPlaceForm?.get('xCoord')?.setValue(x_cord);
      } else if (facing === '2') {
        y_cord = y_cord + moveCount;
        this.myChessPlaceForm?.get('yCoord')?.setValue(y_cord);
      } else if (facing === '3') {
        y_cord = y_cord - moveCount;
        this.myChessPlaceForm?.get('yCoord')?.setValue(y_cord);
      }
    }
    this.initializeBoard();
  }
  /** method to show the final position when user click report button */
  onReport() {
    this.isReport = true;
    this.reportValues.x = this.myChessPlaceForm?.get('xCoord')?.value;
    this.reportValues.y = this.myChessPlaceForm?.get('yCoord')?.value;
    let facing = this.myChessPlaceForm?.get('facing')?.value;
    switch (facing) {
      case '0':
        this.reportValues.facing = 'East';
        break;
      case '1':
        this.reportValues.facing = 'West';
        break;
      case '2':
        this.reportValues.facing = 'North';
        break;
      case '3':
        this.reportValues.facing = 'South';
        break;
    }
    if (this.myChessPlaceForm?.get('color')?.value === '0') {
      this.reportValues.color = 'Black';
    } else {
      this.reportValues.color = 'White';
    }
    this.initializeForm();
    this.isplaceClicked = false;
    this.isFirstMove = false;
    this.counter = 0;
  }
}
