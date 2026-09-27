import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy, Globe, Shield } from 'lucide-react';

interface IpCalculatorProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const IpCalculator: React.FC<IpCalculatorProps> = ({
  language,
  theme,
  onCopy,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [ip, setIp] = useState<string>('192.168.1.1');
  const [cidr, setCidr] = useState<number>(24);

  // Helper functions for IP Subnet Math
  const ipToInt = (ipStr: string) => {
    return ipStr
      .split('.')
      .reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
  };

  const intToIp = (intVal: number) => {
    return [
      (intVal >>> 24) & 255,
      (intVal >>> 16) & 255,
      (intVal >>> 8) & 255,
      intVal & 255,
    ].join('.');
  };

  const isValidIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);

  let networkAddr = '-';
  let broadcastAddr = '-';
  let firstUsable = '-';
  let lastUsable = '-';
  let usableIpsCount = 0;
  let subnetMaskDotted = '-';
  let ipClass = '-';
  let isPrivate = false;

  if (isValidIp) {
    const ipInt = ipToInt(ip);
    const maskInt = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
    const netInt = (ipInt & maskInt) >>> 0;
    const bcastInt = (netInt | ~maskInt) >>> 0;

    networkAddr = intToIp(netInt);
    broadcastAddr = intToIp(bcastInt);
    subnetMaskDotted = intToIp(maskInt);

    if (cidr <= 30) {
      firstUsable = intToIp((netInt + 1) >>> 0);
      lastUsable = intToIp((bcastInt - 1) >>> 0);
      usableIpsCount = Math.max(0, Math.pow(2, 32 - cidr) - 2);
    } else if (cidr === 31) {
      firstUsable = intToIp(netInt);
      lastUsable = intToIp(bcastInt);
      usableIpsCount = 2;
    } else {
      firstUsable = intToIp(netInt);
      lastUsable = intToIp(netInt);
      usableIpsCount = 1;
    }

    const firstOctet = parseInt(ip.split('.')[0], 10);
    if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'Class A';
    else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B';
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C';
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
    else ipClass = 'Class E';

    // Private IP checks
    if (
      firstOctet === 10 ||
      (firstOctet === 172 && parseInt(ip.split('.')[1], 10) >= 16 && parseInt(ip.split('.')[1], 10) <= 31) ||
      (firstOctet === 192 && parseInt(ip.split('.')[1], 10) === 168)
    ) {
      isPrivate = true;
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div
        className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* IP Input */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-400">{t.ipAddress}</label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="e.g. 192.168.1.1"
              className="w-full bg-slate-950 border border-slate-800 text-white font-mono text-sm font-bold px-4 py-2.5 rounded-xl outline-none focus:border-purple-500"
            />
          </div>

          {/* Subnet CIDR Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">CIDR (/{cidr})</label>
            <select
              value={cidr}
              onChange={(e) => setCidr(parseInt(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 text-white font-mono text-sm font-bold px-3 py-2.5 rounded-xl outline-none focus:border-purple-500"
            >
              {Array.from({ length: 33 }).map((_, i) => (
                <option key={i} value={i}>
                  /{i} ({intToIp((i === 0 ? 0 : (0xffffffff << (32 - i)) >>> 0))})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calculated Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: t.networkAddr, val: networkAddr, sub: `Subnet: ${subnetMaskDotted}` },
          { label: t.broadcastAddr, val: broadcastAddr, sub: `Class: ${ipClass}` },
          {
            label: t.usableRange,
            val: `${firstUsable} - ${lastUsable}`,
            sub: `${usableIpsCount.toLocaleString()} Hosts`,
          },
          {
            label: t.typePublicPrivate,
            val: isPrivate ? (language === 'ar' ? 'شبكة خاصة (Private IP)' : 'Private IP') : (language === 'ar' ? 'عنوان عام (Public IP)' : 'Public IP'),
            sub: `CIDR /${cidr}`,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border space-y-1 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
              <span>{item.label}</span>
              <button
                onClick={() => onCopy(item.val)}
                className="hover:text-purple-400"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="font-mono font-bold text-sm sm:text-base text-cyan-400 truncate">
              {item.val}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
