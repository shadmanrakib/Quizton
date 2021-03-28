async function example() {
  const val = await inner();
  return val;
}

const inner = () => {
  return new Error("Hello");
};

try {
  example()
    .then((r) => {
      console.log(r);
    })
    .catch((e) => console.log(`.catch(${e})`));
} catch (e) {
  console.error(`try/catch(${e})`);
}
