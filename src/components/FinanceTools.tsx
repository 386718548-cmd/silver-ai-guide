import { useState, useEffect } from "react";
import { X, Zap, Droplets, Wifi, Phone, CreditCard, Receipt, Calendar, AlertCircle, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  onClose: () => void;
}

// 缴费账单类型
interface BillType {
  id: string;
  name: string;
  icon: any;
  color: string;
  unpaid: string;
  dueDate: string;
  accountNo?: string;
  provider?: string;
}

// 获取账单数据
const getBillData = (): BillType[] => {
  try {
    const stored = localStorage.getItem('bill_data');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return [
    { id: "electricity", name: "电费", icon: Zap, color: "from-amber-400 to-orange-500", unpaid: "125.50", dueDate: "2024-03-25", accountNo: "01012345678", provider: "国家电网" },
    { id: "water", name: "水费", icon: Droplets, color: "from-blue-400 to-cyan-500", unpaid: "68.00", dueDate: "2024-03-28", accountNo: "02012345678", provider: "自来水公司" },
    { id: "gas", name: "燃气费", icon: Receipt, color: "from-rose-400 to-pink-500", unpaid: "89.50", dueDate: "2024-04-01", accountNo: "03012345678", provider: "燃气公司" },
    { id: "phone", name: "手机话费", icon: Phone, color: "from-green-400 to-emerald-500", unpaid: "50.00", dueDate: "2024-03-20", accountNo: "13800008888", provider: "中国移动" },
  ];
};

// 缴费平台
const paymentPlatforms = [
  { id: "wechat", name: "微信", color: "from-green-500 to-green-600", url: "https://pay.weixin.qq.com/" },
  { id: "alipay", name: "支付宝", color: "from-blue-400 to-blue-600", url: "https://www.alipay.com/" },
];

// 获取缴费记录
const getPaymentHistory = () => {
  try {
    const stored = localStorage.getItem('payment_history');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return [
    { name: "电费", date: "2024-03-01", amount: "145.00" },
    { name: "手机话费", date: "2024-02-28", amount: "100.00" },
    { name: "水费", date: "2024-02-15", amount: "72.00" },
  ];
};

export default function FinanceTools({ onClose }: Props) {
  const [billData, setBillData] = useState<BillType[]>(getBillData);
  const [paymentHistory, setPaymentHistory] = useState(getPaymentHistory());
  const [selectedBill, setSelectedBill] = useState<BillType | null>(null);

  // 检查是否过期
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const totalUnpaid = billData.reduce((sum, bill) => sum + parseFloat(bill.unpaid), 0);
  const overdueCount = billData.filter(b => isOverdue(b.dueDate)).length;

  // 跳转到缴费页面
  const handlePay = (bill: BillType) => {
    // 使用支付宝生活缴费
    const url = `https://life.alipay.com/bill/index.htm?billId=${bill.id}`;
    window.open(url, '_blank');
    toast({
      title: `正在跳转到 ${bill.name} 缴费页面...`,
      description: `金额：¥${bill.unpaid}`,
    });
  };

  // 设置提醒
  const handleSetReminder = (bill: BillType) => {
    // 保存提醒设置到本地存储
    try {
      const reminders = JSON.parse(localStorage.getItem('bill_reminders') || '[]');
      reminders.push({ billId: bill.id, dueDate: bill.dueDate });
      localStorage.setItem('bill_reminders', JSON.stringify(reminders));
    } catch {}
    
    toast({
      title: "✅ 已设置提醒",
      description: `${bill.name} 截止前1天会提醒您缴费`,
    });
  };

  // 确认缴费（模拟）
  const handleConfirmPayment = (bill: BillType) => {
    // 添加到缴费记录
    const newRecord = {
      name: bill.name,
      date: new Date().toISOString().split('T')[0],
      amount: bill.unpaid,
    };
    const updated = [newRecord, ...paymentHistory];
    setPaymentHistory(updated);
    localStorage.setItem('payment_history', JSON.stringify(updated));
    
    // 从待缴费中移除
    const updatedBills = billData.filter(b => b.id !== bill.id);
    setBillData(updatedBills);
    localStorage.setItem('bill_data', JSON.stringify(updatedBills));
    
    toast({
      title: "✅ 缴费成功！",
      description: `${bill.name} ¥${bill.unpaid}`,
    });
    setSelectedBill(null);
  };

  // 绑定新账号
  const handleAddBill = () => {
    const name = prompt("请输入缴费项目名称（如：电费、水费）:");
    if (!name) return;
    const accountNo = prompt("请输入账号或户号:");
    if (!accountNo) return;
    const unpaid = prompt("请输入待缴金额:") || "0";
    
    const newBill: BillType = {
      id: Date.now().toString(),
      name,
      icon: Receipt,
      color: "from-slate-400 to-slate-500",
      unpaid,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      accountNo,
    };
    
    const updated = [...billData, newBill];
    setBillData(updated);
    localStorage.setItem('bill_data', JSON.stringify(updated));
    
    toast({ title: "✅ 已添加缴费项目" });
  };

  // 删除账单
  const handleDeleteBill = (id: string) => {
    if (!confirm("确定要删除这个缴费项目吗？")) return;
    const updated = billData.filter(b => b.id !== id);
    setBillData(updated);
    localStorage.setItem('bill_data', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black">生活缴费</h2>
            <p className="text-white/80 text-sm">水电燃气、话费等</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center active:scale-95"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* 待缴费总额 */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white">
          <p className="text-base opacity-80">待缴费总额</p>
          <p className="text-4xl font-black mt-1">¥{totalUnpaid.toFixed(2)}</p>
          <div className="flex items-center gap-2 mt-3">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{billData.length} 项待缴费 {overdueCount > 0 && `· ${overdueCount}项已过期`}</span>
          </div>
        </div>

        {/* 缴费平台快捷入口 */}
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
            缴费平台
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {paymentPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => window.open(platform.url, '_blank')}
                className={`bg-gradient-to-r ${platform.color} rounded-2xl p-4 text-white font-bold shadow-lg active:scale-95`}
              >
                {platform.name} 缴费
              </button>
            ))}
          </div>
        </section>

        {/* 待缴费项目 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
              待缴费项目
            </h3>
            <button onClick={handleAddBill} className="flex items-center gap-1 text-emerald-600 font-bold">
              <Plus className="w-4 h-4" /> 添加
            </button>
          </div>
          <div className="space-y-3">
            {billData.map((bill) => (
              <div
                key={bill.id}
                className={`w-full bg-white rounded-2xl p-4 shadow-md ${isOverdue(bill.dueDate) ? 'border-2 border-red-300' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bill.color} flex items-center justify-center shadow-md`}>
                    <bill.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-800">{bill.name}</p>
                    <p className="text-sm text-slate-500">{bill.accountNo} · {bill.provider || '未知'}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xl font-black ${isOverdue(bill.dueDate) ? 'text-red-500' : 'text-rose-500'}`}>
                        ¥{bill.unpaid}
                      </span>
                      <span className={`text-sm ${isOverdue(bill.dueDate) ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                        截止 {bill.dueDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handlePay(bill)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm"
                    >
                      缴费
                    </button>
                    <button
                      onClick={() => handleDeleteBill(bill.id)}
                      className="p-1 text-slate-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {billData.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p>暂无待缴费项目</p>
                <button onClick={handleAddBill} className="text-emerald-500 font-bold mt-2">
                  点击添加
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 缴费记录 */}
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
            最近缴费记录
          </h3>
          <div className="bg-white rounded-2xl p-4 shadow-md space-y-3">
            {paymentHistory.map((record, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-base font-bold text-slate-800">{record.name}</p>
                  <p className="text-sm text-slate-400">{record.date}</p>
                </div>
                <span className="text-lg font-bold text-emerald-500">-{record.amount} 元</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-3 bg-emerald-100">
        <p className="text-center text-emerald-700 text-base font-medium">
          💡 不会操作？可以请家人帮助代缴
        </p>
      </div>
    </div>
  );
}
