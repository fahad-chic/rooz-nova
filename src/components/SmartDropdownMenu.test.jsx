// اختبار تفاعلي للقائمة المنسدلة الذكية: زر (+) والتنقل للمسار الصحيح.
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SmartDropdownMenu from './SmartDropdownMenu';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderMenu = () =>
  render(
    <MemoryRouter>
      <SmartDropdownMenu />
    </MemoryRouter>
  );

describe('SmartDropdownMenu', () => {
  it('لا تعرض القائمة قبل الضغط على الزر', () => {
    renderMenu();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('تفتح القائمة عند الضغط على زر الأقسام الذكية', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: 'قائمة الأقسام الذكية' }));
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(screen.getByText('فساتين الأعراس')).toBeTruthy();
  });

  it('زر (+) يفتح الفروع ثم التصنيفات التفصيلية (Accordion)', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: 'قائمة الأقسام الذكية' }));

    // الجذر الأول (فساتين الأعراس) — فتح الفروع
    fireEvent.click(screen.getByRole('button', { name: 'إظهار فروع فساتين الأعراس' }));
    expect(screen.getByText('جديدة')).toBeTruthy();
    expect(screen.getByText('مستعملة')).toBeTruthy();

    // فتح تصنيفات فرعية: جديدة -> مقاسات
    fireEvent.click(screen.getByRole('button', { name: 'إظهار تفاصيل جديدة' }));
    expect(screen.getByText('مقاس S')).toBeTruthy();
    expect(screen.getByText('مقاس XL')).toBeTruthy();
  });

  it('اختيار تصنيف يقود إلى مسار الكاتالوج الصحيح مع فلتر المقاس', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: 'قائمة الأقسام الذكية' }));
    fireEvent.click(screen.getByRole('button', { name: 'إظهار فروع فساتين الأعراس' }));
    fireEvent.click(screen.getByRole('button', { name: 'إظهار تفاصيل جديدة' }));

    fireEvent.click(screen.getByText('مقاس M'));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/catalog/wedding-dresses-new',
      expect.objectContaining({ state: expect.objectContaining({ size: 'M' }) })
    );
  });

  it('الخيار الرئيسي بلا صفحة تجميعية يفتح فروع فقط دون تنقل', () => {
    mockNavigate.mockClear();
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: 'قائمة الأقسام الذكية' }));

    const abayasItem = screen.getByText('العبايات').closest('.rooz-smart-item');
    fireEvent.click(within(abayasItem).getByText('العبايات'));
    expect(mockNavigate).not.toHaveBeenCalled();
    // لكن فروعها تظهر
    expect(within(abayasItem).getByText('عبايات فخمة')).toBeTruthy();
  });

  it('الروابط السريعة تنقل إلى صفحاتها المستقلة', () => {
    mockNavigate.mockClear();
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: 'قائمة الأقسام الذكية' }));
    fireEvent.click(screen.getByText('شروط وأحكام الاستخدام'));
    expect(mockNavigate).toHaveBeenCalledWith('/terms');
  });
});
