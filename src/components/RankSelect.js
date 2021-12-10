import React from "react";
import { Select } from ".";

const RankSelect = ({ value, onChange, placeholder, name }) => (
  <Select
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    name={name}
  >
    <option value="AB">AB</option>
    <option value="AMN">AMN</option>
    <option value="A1C">A1C</option>
    <option value="SRA">SRA</option>
    <option value="SSGT">SSGT</option>
    <option value="TSGT">TSGT</option>
    <option value="MSGT">MSGT</option>
    <option value="SMSGT">SMSGT</option>
    <option value="CMSGT">CMSGT</option>
    <option value="2LT">2LT</option>
    <option value="1LT">1LT</option>
    <option value="CAPT">CAPT</option>
    <option value="MAJ">MAJ</option>
    <option value="LTCOL">LTCOL</option>
    <option value="COL">COL</option>
  </Select>
);

export default RankSelect;
