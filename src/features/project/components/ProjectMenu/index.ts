import ProjectMenu from "./ProjectMenu";
import withProjectMenu from "./withProjectMenu";

const ConnectedProjectMenu = withProjectMenu(ProjectMenu);

export { ConnectedProjectMenu as ProjectMenu };