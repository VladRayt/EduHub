'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { FullPageSpinner } from '@/components/ui/spinner';
import { Color } from '@/lib/utils';
import { frontClient } from '@/requests/trpc/client';
import { useUserStore } from '@/store/user.store';
import { skipToken } from '@tanstack/react-query';

const responseToRechartsData = (
  response: {
    value: number;
    userId?: string | undefined;
    organizationId?: string | undefined;
    testId?: number | undefined;
    label?: string | undefined;
  }[]
) => {
  return response.map((dataItem) => ({
    name: dataItem.label,
    Incorrect: 100 - dataItem.value,
    Correct: dataItem.value,
    amp: dataItem.testId ?? dataItem.organizationId ?? dataItem.userId,
  }));
};

export default function ProgressTestPage() {
  const { testId } = useParams();
  const selectedTestId = Array.isArray(testId) ? +testId[0] : +testId;

  const userId = useUserStore((state) => state.user?.id);
  const t = useTranslations('progress.test');

  const { data: testAcrossUsersResponse, isFetching: isFetchingOrganizations } =
    frontClient.analytics.accuracyForTestAcrossUsers.useQuery(
      userId && testId ? { userId, testId: selectedTestId } : skipToken
    );
  const { data: userCreatedTestsResponse, isFetching: isFetchingTests } =
    frontClient.analytics.userCreatedTestsAccuracy.useQuery(userId ? { userId } : skipToken);

  const testAcrossUsersResponseData = responseToRechartsData(testAcrossUsersResponse?.data ?? []);
  const userCreatedTestsData = responseToRechartsData(userCreatedTestsResponse?.data ?? []);

  if (isFetchingTests || isFetchingOrganizations) return <FullPageSpinner />;

  return (
    <main className='w-full flex-1 px-8'>
      <div className='grid md:grid-cols-5 h-full gap-12'>
        <div className='md:col-span-3 rounded-xl outline outline-offset-2 outline-2 p-6 space-y-4'>
          <h3 className='text-lg font-medium'>{t('average-test')}</h3>
          <ResponsiveContainer width='100%' height='90%'>
            <BarChart
              width={500}
              height={300}
              data={testAcrossUsersResponseData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='Correct' stackId='a' fill={Color.SUCCESS} />
              <Bar dataKey='Incorrect' stackId='a' fill={Color.DANGER} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='md:col-span-2 rounded-xl outline outline-offset-2 outline-2 p-6 space-y-4 w-full'>
          <h3 className='text-lg font-medium'>{t('average-tests')}</h3>
          <ResponsiveContainer width='100%' height='90%'>
            <LineChart
              width={500}
              height={300}
              data={userCreatedTestsData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey='Correct' fill={Color.SUCCESS} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
