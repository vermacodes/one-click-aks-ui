import Container from "../../UserInterfaceComponents/Container";
import Footnote from "../../UserInterfaceComponents/Footnote";
import ThemeSwitchRadioGroup from "../../UserInterfaceComponents/ThemeSwitchRadioGroup";

type Props = {};

export default function Theme({}: Props) {
  return (
    <Container title="Theme" collapsible={true}>
      <div className="flex items-center justify-end py-2">
        <ThemeSwitchRadioGroup variant="text" />
      </div>
      <Footnote>
        <p>
          Choose between Light, Dark, and System themes. The system theme
          automatically adjusts based on your operating system's theme settings.
          The light theme is a bright and vibrant theme, while the dark theme is
          designed to reduce eye strain in low-light conditions.
        </p>
      </Footnote>
    </Container>
  );
}
