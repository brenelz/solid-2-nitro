import { dynamic } from '@solidjs/web';
import { getAboutPage } from '../api';

export const route = {
  preload: () => {
    void getAboutPage();
  }
}

export default function About() {
  const AboutUs = dynamic(() => getAboutPage());
  return (
    <AboutUs button={(props: { id: number }) => (
      <button onClick={() => console.log(props.id)}>
        Click me {props.id}
      </button>
    )} />
  )
}
