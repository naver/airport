import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Img: any
  description: JSX.Element;
};


const FeatureList: FeatureItem[] = [
  {
    title: 'Code splitting of language set',
    Img: require("./split.png").default,
    description: (<></>),
  },
  {
    title: 'Number / DateTime / Currency conversion',
    Img: require("./conversion.png").default,
    description: (<></>),
  },
  {
    title: 'GUI Translation management tool',
    Img: require("./program.png").default,
    description: (<></>),
  },
];

function Feature({title, Img, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} src={Img} alt="" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
