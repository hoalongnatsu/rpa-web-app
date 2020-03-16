export function getCanvasPosition(canvas) {
  let top = 0, left = 0;

  while(canvas.tagName !== 'BODY') {
    top += canvas.offsetTop;
    left += canvas.offsetLeft;  
    canvas = canvas.offsetParent;
  }

  return { top, left }
}

export function getMousePositionInCanvas(canvas, event) {
  const canvasPosition = getCanvasPosition(canvas);
  const parent = document.querySelector('.body__image-box');

  const x = (event.clientX + parent.scrollLeft) - (canvasPosition.left + window.pageXOffset);
  const y = (event.clientY + parent.scrollTop) - (canvasPosition.top + window.pageYOffset);
  return { x, y }
} 

export function transformCoordinatesCanvasToCoordinatesImage(data, canvasWidth, canvasHeight, imageWidth, imageHeight) {
  return data.map((item) => {
    const newItem = {...item};
    newItem.x_min = (item.x_min*imageWidth)/canvasWidth;
    newItem.x_max = (item.x_max*imageWidth)/canvasWidth;
    newItem.y_min = (item.y_min*imageHeight)/canvasHeight;
    newItem.y_max = (item.y_max*imageHeight)/canvasHeight;

    return newItem;
  })
}

export function drawBox(context, {x_min, y_min, x_max, y_max, field_name, edit, move}) {

  let colorBox = '#393939',
      colorText = 'white';

  if (edit || move) {
    colorBox = '#F1C40F';
  }

  if (field_name) {
    // Header
    context.beginPath();
    context.fillStyle = colorBox;
    context.fillRect(x_min - 1, y_min - 26, x_max - x_min + 2, 26);
  
    // Text
    context.beginPath();
    context.font = '14px Poppins, sans-serif';
    context.fillStyle = colorText;

    let textWidth = context.measureText(field_name).width;
    
    while(textWidth > x_max - x_min - 20) {
      field_name = field_name.slice(0, -4);
      textWidth = context.measureText(field_name).width;
      field_name = `${field_name}...`;
    }

    context.fillText(field_name, x_min + 10, y_min - 8);
  }

  context.beginPath();
  context.lineWidth = 2;
  context.strokeStyle = colorBox;

  context.strokeRect(
    x_min,
    y_min,
    x_max - x_min,
    y_max - y_min
  );
}

export function checkCoordinatesInExistBox(data, x, y) {
  return data.some(({x_min, y_min, x_max, y_max, show}) => {
    return x > x_min - 1 && x < x_max && y > y_min - 26 && y < y_max  && show
  })
}

export function findBoxByCoordinates(data, x, y) {
  return data.find(({x_min, y_min, x_max, y_max}) => {
    return x > x_min - 1 && x < x_max && y > y_min - 26 && y < y_max
  })
}