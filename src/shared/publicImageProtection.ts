// This only deters normal browser save/copy actions; public image URLs remain accessible.
export function preventPublicImageAction(
  event: Pick<Event, "target" | "preventDefault">,
): void {
  if (event.target instanceof Element && event.target.closest("img, picture")) {
    event.preventDefault();
  }
}
