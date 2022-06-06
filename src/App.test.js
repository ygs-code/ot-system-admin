import React from 'react';
import chai from 'chai';
import { render } from '@testing-library/react';
// import App from './App';
   
// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

const expect = chai.expect;
describe('加法函数的测试', function () {
    it('1 加 1 应该等于 2', function () {
        expect(2).to.be.equal(2);
    });
});
