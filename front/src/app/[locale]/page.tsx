import { redirect } from 'next/navigation';

type Props = {
  params: { locale: string };
};
export default function LocalePage(props: Props) {
  const currentLocale =
    props.params.locale === 'en' || props.params.locale === 'ua' ? props.params.locale : 'en';
  redirect(`/${currentLocale}/home`);
}
