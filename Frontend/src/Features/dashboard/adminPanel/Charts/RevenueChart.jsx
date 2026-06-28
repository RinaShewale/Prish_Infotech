import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const RevenueChart = ({ data }) => (
  <div className="h-[350px] w-full mt-6">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#e6cec8" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#e6cec8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
        <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }}
          itemStyle={{ color: '#e6cec8' }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#e6cec8" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);