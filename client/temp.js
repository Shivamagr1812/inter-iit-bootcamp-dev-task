function extractSegments(input) {
  const segments = [];
  let temp = "";
  let temp2 = "";

  for (let i = 0; i < input.length; i++) {
    // Code block
    if (input[i] === "'" && input[i + 1] === "'" && input[i + 2] === "'") {
      segments.push({ type: "normal text", content: temp2 });
      temp2 = "";

      for (let j = i + 3; j < input.length; j++) {
        if (input[j] === "'" && input[j + 1] === "'" && input[j + 2] === "'") {
          i = j + 2;
          break;
        } else {
          temp += input[j];
        }
      }

      segments.push({ type: "code", content: temp });
      temp = "";
    }
    // Italic
    if (input[i] === "*" && input[i + 1] === "*" && input[i + 2] === "'") {
      segments.push({ type: "normal text", content: temp2 });
      temp2 = "";
      for (let j = i + 3; j < input.length; j++) {
        if (
          input[j] === "'" &&
          input[j + 1] === ":" &&
          input[j + 2] === "*" &&
          input[j + 3] === "*"
        ) {
          i = j + 3;
          break;
        } else {
          temp += input[j];
        }
      }

      segments.push({ type: "italic", content: temp });
      temp = "";
    }
    //Highlighted text
    if (input[i] === "*" && input[i + 1] === "*") {
      segments.push({ type: "normal text", content: temp2 });
      temp2 = "";
      for (let j = i + 2; j < input.length; j++) {
        if (input[j] === "*" && input[j + 1] === "*") {
          i = j + 2;
          break;
        } else {
          temp += input[j];
        }
      }

      segments.push({ type: "heading", content: temp });
      temp = "";
    }
    // Normal text
    if (input[i] !== "*" && input[i] !== "'") {
      temp2 += input[i];
    }
  }

  return segments;
}
