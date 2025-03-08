import { InjectedComponent } from "./popup";

let injectedComp = new InjectedComponent();
injectedComp.hide(true);
document.body.prepend(injectedComp);

function computePositionFromSelection(selection: Selection) {
  let selectionSizes = selection?.getRangeAt(0)?.getBoundingClientRect();
  if (!selectionSizes) return;

  let compSizes = injectedComp.getDimensions();
  // computing horizontal position so it does not get clipped
  let computedLeft =
    selectionSizes.left - compSizes.width / 2 + selectionSizes.width / 2;
  if (computedLeft < 0) computedLeft = 0;
  if (computedLeft + compSizes.width > window.innerWidth) {
    computedLeft = window.innerWidth - compSizes.width;
  }

  // computing vertical position for the same reason
  let computedTop = selectionSizes.top + selectionSizes.height;
  if (computedTop + compSizes.height > window.innerHeight) {
    computedTop = selectionSizes.top - compSizes.height;
  }

  injectedComp.setAbsolutePosition(computedLeft, computedTop);
}

document.addEventListener("mouseup", (e) => {
  let target = e.target as HTMLElement;
  if (!injectedComp.contains(target)) {
    injectedComp.hide(true);
  }

  let selection = window.getSelection();
  if (!selection) return;

  let selectionText = selection?.toString();
  if (selectionText.length !== 0) {
    injectedComp.hide(false);
    computePositionFromSelection(selection);
    return;
  }
});

document.addEventListener("scroll", () => {
  let selection = window.getSelection();
  if (selection && selection.toString().length !== 0) {
    computePositionFromSelection(selection);
  }
});
