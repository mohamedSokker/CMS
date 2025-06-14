function nextColumn(col) {
  let next = "";
  let carry = true;

  for (let i = col.length - 1; i >= 0; i--) {
    if (carry) {
      if (col[i] === "Z") {
        next = "A" + next;
      } else {
        next = String.fromCharCode(col.charCodeAt(i) + 1) + next;
        carry = false;
      }
    } else {
      next = col[i] + next;
    }
  }

  if (carry) {
    next = "A" + next;
  }

  return next;
}

module.exports = { nextColumn };
