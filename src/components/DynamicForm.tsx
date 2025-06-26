// components/DynamicForm/index.tsx

import React from "react";
import { X, Plus, Circle, CheckCircle } from "lucide-react";
import type { FieldConfig, SectionConfig } from "~/types/strategyConfigs";

// ===== 유틸리티 컴포넌트들 =====

// 토글 스위치 컴포넌트
export const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}> = ({ enabled, onChange, label }) => (
  <div className="flex items-center gap-2">
    <button onClick={() => onChange(!enabled)} className="flex items-center gap-1 text-sm">
      {enabled ? (
        <CheckCircle className="w-5 h-5 text-green-400" />
      ) : (
        <Circle className="w-5 h-5 text-gray-400" />
      )}
      <span className={enabled ? "text-green-400" : "text-gray-400"}>{label}</span>
    </button>
  </div>
);

// 배열 입력 컴포넌트
const ArrayInput: React.FC<{
  values: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  placeholder: string;
  type: "string" | "number";
}> = ({ values, onChange, placeholder, type }) => {
  const addValue = () => {
    onChange([...values, type === "number" ? 0 : ""]);
  };

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const updateValue = (index: number, value: string | number) => {
    const newValues = [...values];
    newValues[index] = type === "number" ? Number(value) : value;
    onChange(newValues);
  };

  return (
    <div className="space-y-2">
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type={type === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => updateValue(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            onClick={() => removeValue(index)}
            className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
            title="삭제">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addValue}
        className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all w-full justify-center">
        <Plus className="w-4 h-4" />
        추가
      </button>
    </div>
  );
};

// ===== 메인 동적 필드 컴포넌트 =====

const DynamicField: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  config: any;
}> = ({ field, value, onChange, config }) => {
  // 조건부 렌더링 체크
  if (field.condition && !field.condition(config)) {
    return null;
  }

  const renderFieldContent = () => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            step={field.step}
            min={field.min}
            max={field.max}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        );

      case "select":
        return (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
            {field.options?.map((option) => (
              <option key={String(option.value)} value={option.value} className="bg-slate-800">
                {option.label}
              </option>
            ))}
          </select>
        );

      case "array":
        return (
          <ArrayInput
            values={value || []}
            onChange={onChange}
            placeholder={field.placeholder || ""}
            type={field.arrayType || "string"}
          />
        );

      case "toggle":
        return <ToggleSwitch enabled={value || false} onChange={onChange} label={field.label} />;

      case "grid": {
        const gridClass = getGridClass(field.gridColumns);
        return (
          <div className={`grid ${gridClass} gap-4`}>
            {field.fields?.map((subField, index) => (
              <DynamicField
                key={subField.key || index}
                field={subField}
                value={value?.[subField.key]}
                onChange={(newValue) => onChange({ ...value, [subField.key]: newValue })}
                config={config}
              />
            ))}
          </div>
        );
      }

      case "conditional":
        return field.condition && field.condition(config) ? (
          <div className="space-y-4">
            {field.fields?.map((subField, index) => (
              <DynamicField
                key={subField.key || index}
                field={subField}
                value={value?.[subField.key]}
                onChange={(newValue) => onChange({ ...value, [subField.key]: newValue })}
                config={config}
              />
            ))}
          </div>
        ) : null;

      default:
        return <div className="text-red-400 text-sm">지원되지 않는 필드 타입: {field.type}</div>;
    }
  };

  return (
    <div className="space-y-2">
      {shouldShowLabel(field) && (
        <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
          {field.label}
        </label>
      )}
      {field.type === "conditional" && field.label && (
        <h5 className="flex items-center gap-2 text-sm font-medium text-gray-200">{field.label}</h5>
      )}
      {renderFieldContent()}
      {field.description && <p className="text-xs text-gray-400">{field.description}</p>}
    </div>
  );
};

// ===== 동적 섹션 컴포넌트 =====

export const DynamicSection: React.FC<{
  section: SectionConfig;
  sectionKey: string;
  config: any;
  onChange: (sectionKey: string, updates: any) => void;
}> = ({ section, sectionKey, config, onChange }) => {
  const sectionData = config[sectionKey] || {};

  const handleFieldChange = (fieldKey: string, value: any) => {
    if (!fieldKey) return; // grid나 conditional 같은 경우
    onChange(sectionKey, { ...sectionData, [fieldKey]: value });
  };

  return (
    <div className="space-y-4">
      <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
        <section.icon size={16} />
        {section.title}
      </h4>
      <div className="space-y-4">
        {section.fields.map((field, index) => (
          <DynamicField
            key={field.key || index}
            field={field}
            value={field.key ? sectionData[field.key] : sectionData}
            onChange={(value) => {
              if (field.key) {
                handleFieldChange(field.key, value);
              } else {
                // grid나 conditional 타입의 경우 직접 업데이트
                onChange(sectionKey, { ...sectionData, ...value });
              }
            }}
            config={config}
          />
        ))}
      </div>
    </div>
  );
};

// ===== 헬퍼 함수들 =====

/**
 * 그리드 컬럼 수에 따른 CSS 클래스 반환
 */
function getGridClass(gridColumns?: number): string {
  switch (gridColumns) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-3";
    case 4:
      return "grid-cols-4";
    default:
      return "grid-cols-1";
  }
}

/**
 * 라벨을 표시해야 하는지 확인
 */
function shouldShowLabel(field: FieldConfig): boolean {
  return !!(
    field.label &&
    field.type !== "toggle" &&
    field.type !== "grid" &&
    field.type !== "conditional"
  );
}
