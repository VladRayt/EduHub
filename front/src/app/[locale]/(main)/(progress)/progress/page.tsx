'use client';

import React, { useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { FullPageSpinner } from '@/components/ui/spinner';
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
    accuracy: dataItem.value,
    amp: dataItem.testId ?? dataItem.organizationId ?? dataItem.userId,
  }));
};

// Custom Tooltip Components
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className='bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-xl'>
        <p className='font-semibold text-gray-800'>{data.name}</p>
        <p className='text-sm text-gray-600'>
          <span
            className='inline-block w-3 h-3 rounded-full mr-2'
            style={{ backgroundColor: data.color }}
          ></span>
          {data.value.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-xl max-w-xs'>
        <p className='font-semibold text-gray-800 mb-2'>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className='text-sm text-gray-600'>
            <span
              className='inline-block w-3 h-3 rounded-full mr-2'
              style={{ backgroundColor: entry.color }}
            ></span>
            {entry.dataKey}: {entry.value.toFixed(1)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className='flex justify-center gap-6 mt-4'>
      {payload.map((entry: any, index: number) => (
        <div key={index} className='flex items-center gap-2'>
          <div
            className='w-4 h-4 rounded-full shadow-sm'
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className='text-sm font-medium text-gray-700'>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Chart Type Selector
const ChartTypeSelector = ({
  chartType,
  setChartType,
  options,
}: {
  chartType: string;
  setChartType: (type: string) => void;
  options: { value: string; label: string; icon: string }[];
}) => {
  return (
    <div className='flex bg-gray-100 rounded-lg p-1 gap-1'>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setChartType(option.value)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            chartType === option.value
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span>{option.icon}</span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default function ProgressPage() {
  const userId = useUserStore((state) => state.user?.id);
  const router = useRouter();
  const { locale = 'en' } = useParams();
  const t = useTranslations('progress.home');

  // Chart type states
  const [userChartType, setUserChartType] = useState('pie');
  const [testsChartType, setTestsChartType] = useState('bar');
  const [orgsChartType, setOrgsChartType] = useState('area');

  const { data: userCompletedTestsResponse, isFetching: isFetchingTests } =
    frontClient.analytics.userCompletedTestsAccuracy.useQuery(userId ? { userId } : skipToken);

  const { data: userOrganizationsResponse, isFetching: isFetchingOrganizations } =
    frontClient.analytics.userOrganizationsAccuracy.useQuery(userId ? { userId } : skipToken);

  const handleClickTest = ({ activeLabel }: { activeLabel: string }) => {
    const selectedTest = (userCompletedTestsResponse?.data ?? []).find((test) =>
      test.label ? test.label.toLowerCase().includes(activeLabel.toLowerCase()) : false
    )?.testId;
    if (selectedTest) {
      router.push(`/${locale}/progress/test/${selectedTest}`);
    }
  };

  const handleClickOrganization = ({ activeLabel }: { activeLabel: string }) => {
    const selectedOrganization = (userOrganizationsResponse?.data ?? []).find((org) =>
      org.label ? org.label.toLowerCase().includes(activeLabel.toLowerCase()) : false
    )?.organizationId;
    if (selectedOrganization) {
      router.push(`/${locale}/progress/organization/${selectedOrganization}`);
    }
  };

  const accuracyAverageData = useMemo(() => {
    const data = userCompletedTestsResponse?.data ?? [];
    const totalCorrectPercentage = data.reduce((acc, curr) => acc + curr.value, 0) / data.length;
    const totalIncorrectPercentage = 100 - totalCorrectPercentage;

    return [
      { value: totalCorrectPercentage, name: 'Correct', fill: '#10B981' },
      { value: totalIncorrectPercentage, name: 'Incorrect', fill: '#EF4444' },
    ];
  }, [userCompletedTestsResponse]);

  const radialData = useMemo(() => {
    const data = userCompletedTestsResponse?.data ?? [];
    const totalCorrectPercentage = data.reduce((acc, curr) => acc + curr.value, 0) / data.length;
    return [{ name: 'Accuracy', value: totalCorrectPercentage, fill: '#10B981' }];
  }, [userCompletedTestsResponse]);

  const userCompletedTestsDataForRecharts = responseToRechartsData(
    userCompletedTestsResponse?.data ?? []
  );
  const userOrganizationsDataForRecharts = responseToRechartsData(
    userOrganizationsResponse?.data ?? []
  );

  const chartOptions = {
    user: [
      { value: 'pie', label: 'Pie', icon: '🥧' },
      { value: 'donut', label: 'Donut', icon: '🍩' },
      { value: 'radial', label: 'Radial', icon: '🎯' },
    ],
    tests: [
      { value: 'bar', label: 'Bar', icon: '📊' },
      { value: 'line', label: 'Line', icon: '📈' },
      { value: 'area', label: 'Area', icon: '🏔️' },
    ],
    orgs: [
      { value: 'area', label: 'Area', icon: '🏔️' },
      { value: 'bar', label: 'Bar', icon: '📊' },
      { value: 'line', label: 'Line', icon: '📈' },
    ],
  };

  const renderUserChart = () => {
    const commonDefs = (
      <defs>
        <linearGradient id='successGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#10B981' />
          <stop offset='100%' stopColor='#059669' />
        </linearGradient>
        <linearGradient id='dangerGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#EF4444' />
          <stop offset='100%' stopColor='#DC2626' />
        </linearGradient>
      </defs>
    );

    switch (userChartType) {
      case 'pie':
        return (
          <PieChart width={500} height={300} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            {commonDefs}
            <Tooltip content={<CustomPieTooltip />} />
            <Legend content={<CustomLegend />} />
            <Pie
              dataKey='value'
              data={accuracyAverageData}
              cx='50%'
              cy='45%'
              outerRadius={120}
              paddingAngle={2}
            >
              {accuracyAverageData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? 'url(#successGradient)' : 'url(#dangerGradient)'}
                  stroke='white'
                  strokeWidth={3}
                />
              ))}
            </Pie>
          </PieChart>
        );
      case 'donut':
        return (
          <PieChart width={500} height={300} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            {commonDefs}
            <Tooltip content={<CustomPieTooltip />} />
            <Legend content={<CustomLegend />} />
            <Pie
              dataKey='value'
              data={accuracyAverageData}
              cx='50%'
              cy='45%'
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
            >
              {accuracyAverageData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? 'url(#successGradient)' : 'url(#dangerGradient)'}
                  stroke='white'
                  strokeWidth={3}
                />
              ))}
            </Pie>
          </PieChart>
        );
      case 'radial':
        return (
          <RadialBarChart
            width={500}
            height={300}
            cx='50%'
            cy='50%'
            innerRadius='20%'
            outerRadius='90%'
            data={radialData}
            startAngle={180}
            endAngle={0}
          >
            {commonDefs}
            <RadialBar
              dataKey='value'
              cornerRadius={10}
              fill='url(#successGradient)'
              background={{ fill: '#F3F4F6' }}
            />
            <Legend content={<CustomLegend />} />
            <Tooltip content={<CustomPieTooltip />} />
          </RadialBarChart>
        );
      default:
        return null;
    }
  };

  const renderTestsChart = () => {
    const commonDefs = (
      <defs>
        <linearGradient id='correctBarGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='#10B981' />
          <stop offset='100%' stopColor='#059669' />
        </linearGradient>
        <linearGradient id='incorrectBarGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='#EF4444' />
          <stop offset='100%' stopColor='#DC2626' />
        </linearGradient>
        <linearGradient id='areaGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='#3B82F6' stopOpacity={0.8} />
          <stop offset='100%' stopColor='#3B82F6' stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );

    const commonProps = {
      width: 500,
      height: 300,
      data: userCompletedTestsDataForRecharts,
      onClick: handleClickTest,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    const commonElements = (
      <>
        <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' strokeWidth={1} />
        <XAxis
          dataKey='name'
          tick={{ fontSize: 12, fill: '#6B7280' }}
          axisLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
          tickLine={{ stroke: '#9CA3AF' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6B7280' }}
          axisLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
          tickLine={{ stroke: '#9CA3AF' }}
        />
        <Tooltip content={<CustomBarTooltip />} />
        <Legend content={<CustomLegend />} />
      </>
    );

    switch (testsChartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {commonDefs}
            {commonElements}
            <Bar
              dataKey='Correct'
              stackId='a'
              fill='url(#correctBarGradient)'
              radius={[0, 0, 4, 4]}
              cursor='pointer'
            />
            <Bar
              dataKey='Incorrect'
              stackId='a'
              fill='url(#incorrectBarGradient)'
              radius={[4, 4, 0, 0]}
              cursor='pointer'
            />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            {commonDefs}
            {commonElements}
            <Line
              type='monotone'
              dataKey='accuracy'
              stroke='#3B82F6'
              strokeWidth={3}
              dot={{ r: 6, fill: '#3B82F6' }}
              activeDot={{ r: 8, fill: '#1D4ED8' }}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {commonDefs}
            {commonElements}
            <Area
              type='monotone'
              dataKey='accuracy'
              stroke='#3B82F6'
              strokeWidth={2}
              fill='url(#areaGradient)'
            />
          </AreaChart>
        );
      default:
        return null;
    }
  };

  const renderOrganizationsChart = () => {
    const commonDefs = (
      <defs>
        <linearGradient id='correctOrgGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='#10B981' />
          <stop offset='100%' stopColor='#059669' />
        </linearGradient>
        <linearGradient id='incorrectOrgGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='#EF4444' />
          <stop offset='100%' stopColor='#DC2626' />
        </linearGradient>
        <linearGradient id='orgAreaGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='#8B5CF6' stopOpacity={0.8} />
          <stop offset='100%' stopColor='#8B5CF6' stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );

    const commonProps = {
      width: 500,
      height: 300,
      data: userOrganizationsDataForRecharts,
      onClick: handleClickOrganization,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    const commonElements = (
      <>
        <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' strokeWidth={1} />
        <XAxis
          dataKey='name'
          tick={{ fontSize: 12, fill: '#6B7280' }}
          axisLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
          tickLine={{ stroke: '#9CA3AF' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6B7280' }}
          axisLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
          tickLine={{ stroke: '#9CA3AF' }}
        />
        <Tooltip content={<CustomBarTooltip />} />
        <Legend content={<CustomLegend />} />
      </>
    );

    switch (orgsChartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {commonDefs}
            {commonElements}
            <Area
              type='monotone'
              dataKey='accuracy'
              stroke='#8B5CF6'
              strokeWidth={2}
              fill='url(#orgAreaGradient)'
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {commonDefs}
            {commonElements}
            <Bar
              dataKey='Correct'
              stackId='a'
              fill='url(#correctOrgGradient)'
              radius={[0, 0, 4, 4]}
              cursor='pointer'
            />
            <Bar
              dataKey='Incorrect'
              stackId='a'
              fill='url(#incorrectOrgGradient)'
              radius={[4, 4, 0, 0]}
              cursor='pointer'
            />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            {commonDefs}
            {commonElements}
            <Line
              type='monotone'
              dataKey='accuracy'
              stroke='#8B5CF6'
              strokeWidth={3}
              dot={{ r: 6, fill: '#8B5CF6' }}
              activeDot={{ r: 8, fill: '#7C3AED' }}
            />
          </LineChart>
        );
      default:
        return null;
    }
  };

  if (isFetchingOrganizations || isFetchingTests) return <FullPageSpinner />;

  return (
    <main className='w-full flex-1 px-8 py-6 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen'>
      <div className='grid md:grid-cols-5 h-full gap-8'>
        {/* Average User Chart */}
        <div className='md:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
              {t('average-user')}
            </h3>
            <div className='w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-pulse'></div>
          </div>
          <ChartTypeSelector
            chartType={userChartType}
            setChartType={setUserChartType}
            options={chartOptions.user}
          />
          <ResponsiveContainer width='100%' height='85%'>
            {renderUserChart()}
          </ResponsiveContainer>
        </div>

        {/* Tests Chart */}
        <div className='md:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
              {t('average-tests')}
            </h3>
            <div className='w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse'></div>
          </div>
          <ChartTypeSelector
            chartType={testsChartType}
            setChartType={setTestsChartType}
            options={chartOptions.tests}
          />
          <ResponsiveContainer width='100%' height='85%'>
            {renderTestsChart()}
          </ResponsiveContainer>
        </div>

        {/* Organizations Chart */}
        <div className='md:col-span-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
              {t('average-organizations')}
            </h3>
            <div className='w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse'></div>
          </div>
          <ChartTypeSelector
            chartType={orgsChartType}
            setChartType={setOrgsChartType}
            options={chartOptions.orgs}
          />
          <ResponsiveContainer width='100%' height='85%'>
            {renderOrganizationsChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
