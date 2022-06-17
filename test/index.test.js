const raw_md = `
::if flag.value_1

if

::elif flag.value_2

elif

::else

else

::endif

endif
`;

describe("intersect", () => {
  it("should intersect", () => {
    expect().toEqual(true);
  });
});
