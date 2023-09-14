import React, {useCallback, useMemo} from 'react';
import RangeSliderRN from 'rn-range-slider';
import Label from './Label';
import Thumb from './Thumb';
import Rail from './Rail';
import RailSelected from './RailSelected';
interface PriceProps {
  handlePriceChange: any;
  pointsCoefficient: number;
  filterOption: string;
  from: number;
  to: number;
}
const PriceRangeFilter: React.FC<PriceProps> = ({
  pointsCoefficient,
  handlePriceChange,
  filterOption,
  from,
  to,
}) => {
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(
    (value: number) => (
      <Label
        text={filterOption === 'GEL' ? value : value * pointsCoefficient}
      />
    ),
    [filterOption],
  );

  return (
    <>
      <RangeSliderRN
        min={from}
        max={to}
        step={1}
        floatingLabel
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        onValueChanged={handlePriceChange}
      />
    </>
  );
};

export default PriceRangeFilter;
