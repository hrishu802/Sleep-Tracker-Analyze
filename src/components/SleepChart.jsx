import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  TimeScale
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { formatDuration } from '../utils/sleepUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const SleepChart = ({ sleepData, chartType = 'duration' }) => {
  if (!sleepData || sleepData.length === 0) {
    return <div className="text-center p-6">No sleep data available</div>;
  }

  const sortedData = [...sleepData].sort((a, b) => new Date(a.date) - new Date(b.date));

  const labels = sortedData.map(entry => {
    const date = new Date(entry.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  let datasets = [];
  let options = {};

  switch (chartType) {
    case 'duration':
      datasets = [
        {
          label: 'Sleep Duration (hours)',
          data: sortedData.map(entry => entry.duration),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          tension: 0.3,
        }
      ];
      
      options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Sleep Duration Over Time',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Duration: ${formatDuration(context.raw)}`;
              }
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: Math.max(10, Math.ceil(Math.max(...sortedData.map(entry => entry.duration)))),
            title: {
              display: true,
              text: 'Hours'
            }
          }
        }
      };
      break;

    case 'quality':
      datasets = [
        {
          label: 'Sleep Quality',
          data: sortedData.map(entry => entry.quality),
          backgroundColor: 'rgba(139, 92, 246, 0.5)',
          borderColor: 'rgb(139, 92, 246)',
          borderWidth: 1,
        }
      ];
      
      options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Sleep Quality Over Time',
            font: {
              size: 16
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            title: {
              display: true,
              text: 'Quality Score'
            }
          }
        }
      };
      break;

    case 'bedtime':
      const bedtimeValues = sortedData.map(entry => {
        const date = new Date(entry.sleepTime);
        return date.getHours() + (date.getMinutes() / 60);
      });
      
      datasets = [
        {
          label: 'Bedtime',
          data: bedtimeValues,
          borderColor: 'rgb(248, 113, 113)',
          backgroundColor: 'rgba(248, 113, 113, 0.2)',
          tension: 0.3,
        }
      ];
      
      options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Bedtime Consistency',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const hours = Math.floor(context.raw);
                const minutes = Math.round((context.raw - hours) * 60);
                return `Time: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
              }
            }
          }
        },
        scales: {
          y: {
            reverse: true,
            min: Math.min(18, Math.floor(Math.min(...bedtimeValues))),
            max: Math.max(24, Math.ceil(Math.max(...bedtimeValues))),
            title: {
              display: true,
              text: 'Time (24h)'
            },
            ticks: {
              callback: function(value) {
                return `${Math.floor(value)}:00`;
              }
            }
          }
        }
      };
      break;

    default:
      break;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {chartType === 'quality' ? (
        <Bar data={{ labels, datasets }} options={options} />
      ) : (
        <Line data={{ labels, datasets }} options={options} />
      )}
    </div>
  );
};

export default SleepChart;
