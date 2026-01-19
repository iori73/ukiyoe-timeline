import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '../context/LanguageContext'

// Simple smoke test to verify testing setup works
describe('Testing Setup', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true)
  })

  it('should have access to DOM testing utilities', () => {
    const element = document.createElement('div')
    element.textContent = 'Hello Ukiyoe'
    document.body.appendChild(element)
    
    expect(element).toBeInTheDocument()
    expect(element).toHaveTextContent('Hello Ukiyoe')
    
    document.body.removeChild(element)
  })
})

// Example of how to test a component with providers
describe('Component Testing Example', () => {
  it('can render components with necessary providers', () => {
    // This is a template for testing components that need:
    // - React Router (BrowserRouter)
    // - Language Context (LanguageProvider)
    
    const TestComponent = () => <div data-testid="test">Test Content</div>
    
    render(
      <BrowserRouter>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </BrowserRouter>
    )
    
    expect(screen.getByTestId('test')).toBeInTheDocument()
    expect(screen.getByTestId('test')).toHaveTextContent('Test Content')
  })
})

